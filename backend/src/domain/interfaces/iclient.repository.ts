import { ClientEntity } from '../entities/client.entity';

export interface IClientRepository {
  findAll(options: {
    filter?: string;
    current_page?: number;
    limit?: number;
    user_id: string | null;
  }): Promise<{
    current_page: number;
    total_pages: number;
    total_items: number;
    limit: number;
    in_page: number;
    has_next_page: boolean;
    has_previous_page: boolean;
    data: ClientEntity[];
  }>;
}
