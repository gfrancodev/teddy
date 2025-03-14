export const INTERNAL_ERRORS = [
  {
    code: 5000,
    identifier: 'INTERNAL_DATABASE_ERROR',
    client_message: 'Internal server error',
    message: 'An error occurred while processing the database operation',
    description:
      'This error occurs when there is a failure in the database operation',
    status: 500,
  },
  {
    code: 5001,
    identifier: 'INTERNAL_VALIDATION_ERROR',
    client_message: 'Invalid data',
    message: 'The provided data does not meet the validation criteria',
    description:
      'This error occurs when the data fails the class-validator validation',
    status: 412,
  },
  {
    code: 5002,
    identifier: 'INTERNAL_FORBIDDEN_ERROR',
    client_message: 'Access denied',
    message: 'Access to the requested resource was denied',
    description:
      'This error occurs when the user attempts to access a resource for which they do not have permission',
    status: 403,
  },
] as const;
