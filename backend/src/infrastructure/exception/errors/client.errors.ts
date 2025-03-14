export const CLIENT_ERRORS = [
  {
    code: 3000,
    identifier: 'CLIENT_INVALID_INPUT',
    client_message: 'Invalid input provided',
    message: 'The input data does not meet the required format',
    description:
      'This error occurs when the client sends data that does not conform to the expected format or structure.',
    status: 412,
  },
  {
    code: 3002,
    identifier: 'CLIENT_DUPLICATE_NAME',
    client_message: 'Name already in use',
    message: 'The provided name already exists in the system',
    description:
      'This error is triggered when attempting to register a client with a name that is already associated with another client account. Note: The schema allows for duplicate names, so this error might not be applicable in all scenarios.',
    status: 409,
  },
  {
    code: 3003,
    identifier: 'CLIENT_INVALID_SALARY',
    client_message: 'Invalid salary provided',
    message: 'The provided salary does not meet the required criteria',
    description:
      'This error occurs when the client provides a salary that does not conform to the expected format or value.',
    status: 412,
  },
  {
    code: 3004,
    identifier: 'CLIENT_INVALID_COMPANY_VALUE',
    client_message: 'Invalid company value provided',
    message: 'The provided company value does not meet the required criteria',
    description:
      'This error occurs when the client provides a company value that does not conform to the expected format or value.',
    status: 412,
  },
  {
    code: 3005,
    identifier: 'CLIENT_NOT_FOUND',
    client_message: 'Client not found',
    message: 'The requested client does not exist in the system',
    description:
      'This error is thrown when attempting to retrieve, update, or delete a client that does not exist in the database.',
    status: 404,
  },
] as const;
