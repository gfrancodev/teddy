export const AUTH_ERRORS = [
  {
    code: 6000,
    identifier: 'AUTH_INVALID_CREDENTIALS',
    client_message: 'Invalid credentials',
    message: 'The provided credentials are invalid',
    description:
      'This error occurs when the provided credentials do not match our records',
    status: 401,
  },
  {
    code: 6001,
    identifier: 'AUTH_REGISTRATION_FAILED',
    client_message: 'Registration failed',
    message: 'Failed to register new user',
    description:
      'This error occurs when the registration process fails due to an internal error',
    status: 500,
  },
  {
    code: 6002,
    identifier: 'AUTH_PASSWORD_HASH_FAILED',
    client_message: 'Registration failed',
    message: 'Failed to secure password',
    description: 'This error occurs when the password hashing process fails',
    status: 500,
  },
  {
    code: 6003,
    identifier: 'AUTH_TOKEN_EXPIRED',
    client_message: 'Session expired',
    message: 'The authentication token has expired',
    description: 'This error occurs when the JWT token has expired',
    status: 401,
  },
  {
    code: 6004,
    identifier: 'AUTH_TOKEN_INVALID',
    client_message: 'Invalid session',
    message: 'The authentication token is invalid',
    description: 'This error occurs when the JWT token is invalid or malformed',
    status: 401,
  },
  {
    identifier: 'USER_INACTIVE',
    code: 6003,
    status: 403,
    client_message: 'User account is inactive',
    server_message: 'User attempted to login with inactive account',
  },
] as const;
