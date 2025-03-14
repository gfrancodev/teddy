import { Roles } from '../enum/role.enum';
import { Status } from '../enum/status.enum';

export class UserEntity {
  id: string;
  fullname: string;
  email: string;
  username: string;
  last_access: number | null;
  password: string;
  status: Status;
  role: Roles;
  verified: boolean;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;

  constructor(props: Partial<UserEntity>) {
    Object.assign(this, props);
  }
}
