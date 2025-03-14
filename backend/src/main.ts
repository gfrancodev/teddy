import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as compression from 'compression';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { useContainer } from 'class-validator';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';

const logger = new Logger('BOOTSTRAP');

async function configureSwagger(
  app: INestApplication,
  title: string,
  path: string,
) {
  const config = new DocumentBuilder()
    .setTitle(title)
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(path, app, document);

  const filePath = `${process.cwd()}/docs/swagger.json`;

  mkdirSync(`./docs`, { recursive: true });
  writeFileSync(`${filePath}`, JSON.stringify(document, null, 2));
  const swaggerJson = JSON.parse(readFileSync(filePath, 'utf8'));
  logger.debug(
    `There are ${Object.keys(swaggerJson.paths).length} documented routes in ${title}`,
  );
  return {
    swaggerPath: path,
    swaggerFile: filePath,
  };
}

async function bootstrap() {
  process.env.TZ = 'Americao/Sao_Paulo';
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });
  app.use(compression());
  app.use(helmet());
  app.enableShutdownHooks();

  const { swaggerFile, swaggerPath } = await configureSwagger(
    app,
    'TEDDY BACKEND',
    '/v1/docs',
  );

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
    }),
  );
  const configService = app.get(ConfigService);
  const port = Number(configService.get('PORT') || 3000);
  app.listen(port);
  return {
    port,
    doc_file: swaggerFile,
    doc_path: swaggerPath,
  };
}
bootstrap().then(async ({ port, doc_file, doc_path }) => {
  const environment = process.env.NODE_ENV || 'local';
  logger.log(`ENVIRONMENT ${environment}`);
  logger.log(`RUNNING IN PORT ${port}`);
  logger.log(`API DOCUMENTATION http://localhost:${port}${doc_path}`);
  logger.log(`SWAGGER FILE OPENAPI V3 file://${doc_file}`);
});
