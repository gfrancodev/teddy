export const USER_ERRORS = [
  {
    code: 1000,
    identifier: 'USER_EMAIL_ALREADY_EXISTS',
    client_message: 'Email is already in use',
    message: 'The provided email already exists in the system',
    description:
      'This error is triggered when attempting to register a user with an email that is already associated with another user account.',
    status: 409,
  },
  {
    code: 1001,
    identifier: 'USER_USERNAME_ALREADY_EXISTS',
    client_message: 'Username is already in use',
    message: 'The provided username already exists in the system',
    description:
      'This error is triggered when attempting to register a user with a username that is already associated with another user account.',
    status: 409,
  },
  {
    code: 1002,
    identifier: 'USER_NOT_FOUND',
    client_message: 'User not found',
    message: 'The requested user does not exist in the system',
    description:
      'This error occurs when attempting to access or perform an action on a user that does not exist in the database.',
    status: 404,
  },
  {
    code: 1003,
    identifier: 'USER_ALREADY_VERIFIED',
    client_message: 'User already verified',
    message: 'The user account is already verified',
    description:
      'This error is triggered when attempting to verify a user account that has already been verified.',
    status: 409,
  },
  {
    code: 1004,
    identifier: 'USER_NOT_VERIFIED',
    client_message: 'User not verified',
    message: 'The user account is not verified',
    description:
      'This error occurs when attempting to perform an action that requires a verified user account.',
    status: 403,
  },
] as const;
