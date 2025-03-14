import { INestApplication } from '@nestjs/common';
import supertest from 'supertest';
import { createTestingApp } from './setup-e2e';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createTestingApp();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return supertest(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
