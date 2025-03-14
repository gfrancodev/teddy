import { USER_ERRORS } from '../errors/user.errors';
import { CLIENT_ERRORS } from '../errors/client.errors';
import { INTERNAL_ERRORS } from '../errors/internal.errors';
import { AUTH_ERRORS } from '../errors/auth.errors';

export interface ErrorFormat {
  code: number;
  identifier: string;
  client_message: string;
  message: string;
  description: string;
  status: number;
}

export interface ErrorResponse {
  success: boolean;
  error: {
    id: string;
    status: number;
    name: string;
    details: {
      timestamp: string;
      path: string;
      code: number;
      description: string;
      [key: string]: any;
    };
  };
}

type AuthIdentifier = (typeof AUTH_ERRORS)[number]['identifier'];
type UserIdentifier = (typeof USER_ERRORS)[number]['identifier'];
type ClientIdentifier = (typeof CLIENT_ERRORS)[number]['identifier'];
type InternalIdentifier = (typeof INTERNAL_ERRORS)[number]['identifier'];

/**
 * Type that represents valid error identifiers
 * Can be a predefined static identifier or a custom string
 * If the identifier does not exist, it should raise an error
 *
 * @type ErrorIdentifier
 */
export type ErrorIdentifier =
  | UserIdentifier
  | ClientIdentifier
  | InternalIdentifier
  | AuthIdentifier
  | (string & { error: 'Identifier does not exist' });
