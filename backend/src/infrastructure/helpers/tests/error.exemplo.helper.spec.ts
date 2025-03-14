import { describe, it, expect } from 'vitest';
import { errorExemplo } from '../error.exemplo.helper';

describe('errorExemplo Helper', () => {
  it('deve criar um objeto de erro com os parâmetros fornecidos', () => {
    const error = errorExemplo(
      404,
      1001,
      'Recurso não encontrado',
      'NotFoundError',
      '/api/resource',
      { additionalInfo: 'Informação extra' },
    );

    expect(error).toEqual({
      success: false,
      error: {
        id: expect.any(String),
        status: 404,
        name: 'NotFoundError',
        details: {
          timestamp: expect.any(String),
          path: '/api/resource',
          code: 1001,
          description: 'Recurso não encontrado',
        },
        additionalInfo: 'Informação extra',
      },
    });
  });

  it('deve criar um objeto de erro sem detalhes adicionais', () => {
    const error = errorExemplo(
      400,
      1002,
      'Requisição inválida',
      'BadRequestError',
      '/api/resource',
    );

    expect(error).toEqual({
      success: false,
      error: {
        id: expect.any(String),
        status: 400,
        name: 'BadRequestError',
        details: {
          timestamp: expect.any(String),
          path: '/api/resource',
          code: 1002,
          description: 'Requisição inválida',
        },
      },
    });
  });
});
