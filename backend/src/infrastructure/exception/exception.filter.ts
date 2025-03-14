import {
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Exception } from './builder/exception';
import { USER_ERRORS } from './errors/user.errors';
import { CLIENT_ERRORS } from './errors/client.errors';
import { INTERNAL_ERRORS } from './errors/internal.errors';
import { ErrorFormat, ErrorResponse } from './types';
import { AUTH_ERRORS } from './errors/auth.errors';

@Catch()
export class GlobalExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: Error | HttpException, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const errorId = crypto.randomUUID();

    this.logError(errorId, exception, request.path);
    const errorResponse = this.handleException(
      exception,
      request.path,
      errorId,
    );

    httpAdapter.reply(
      ctx.getResponse(),
      errorResponse,
      errorResponse.error.status,
    );
  }

  private handleException(
    exception: Error | HttpException,
    path: string,
    errorId: string,
  ): ErrorResponse {
    if (exception instanceof Exception) {
      const error = this.findErrorByIdentifier(
        exception.identifier,
      ) as ErrorFormat;
      const status = Number(error.status ?? 500);
      return this.createErrorResponse({
        errorId,
        code: error.code,
        status,
        description:
          status === 500
            ? 'An internal server error occurred'
            : error.client_message,
        path,
        details: status !== 500 ? exception.details : undefined,
      });
    }

    if (exception instanceof BadRequestException) {
      const response = exception.getResponse();
      return this.createErrorResponse({
        errorId,
        code: 1412,
        status: 412,
        description: 'Invalid Fields',
        path,
        details: {
          fields: (response as any).message,
        },
      });
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      return this.createErrorResponse({
        errorId,
        code: status,
        status,
        description: exception.message,
        path,
      });
    }

    return this.createErrorResponse({
      errorId,
      code: 5000,
      status: 500,
      description: 'An internal server error occurred',
      path,
    });
  }

  private createErrorResponse(params: {
    errorId: string;
    code: number;
    status: number;
    description: string;
    path: string;
    details?: Record<string, any>;
  }): ErrorResponse {
    return {
      success: false,
      error: {
        id: params.errorId,
        status: params.status,
        name: this.getHttpStatusName(params.status),
        details: {
          timestamp: new Date().toISOString(),
          path: params.path,
          code: params.code,
          description: params.description,
          ...(params.details || {}),
        },
      },
    };
  }

  private findErrorByIdentifier(identifier: string) {
    const allErrors = [
      ...USER_ERRORS,
      ...CLIENT_ERRORS,
      ...INTERNAL_ERRORS,
      ...AUTH_ERRORS,
    ];
    return (
      allErrors.find((error) => error.identifier === identifier) ||
      INTERNAL_ERRORS[0]
    );
  }

  private getHttpStatusName(status: number): string {
    const statusMap: Record<number, string> = {
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      409: 'Conflict',
      412: 'Precondition Failed',
      500: 'Internal Server Error',
    };
    return statusMap[status] || 'Unknown Error';
  }

  private logError(errorId: string, exception: Error, path: string): void {
    const errorDetails =
      exception instanceof Exception
        ? this.findErrorByIdentifier(exception.identifier)
        : null;

    this.logger.error({
      id: errorId,
      path,
      error: {
        name: exception.name,
        message: exception.message,
        stack: exception.stack,
        ...(exception instanceof Exception && {
          details: {
            ...errorDetails,
          },
        }),
        ...(exception instanceof HttpException && {
          status: exception.getStatus(),
          response: exception.getResponse(),
        }),
      },
    });
  }
}
