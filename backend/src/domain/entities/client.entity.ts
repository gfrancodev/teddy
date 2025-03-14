import { Status } from '../enum/status.enum';

export class ClientEntity {
  id: number;
  user_id: string;
  name: string;
  salary: number;
  company_value: number;
  status: Status;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;

  constructor(props: Partial<ClientEntity>) {
    Object.assign(this, props);
  }
}
