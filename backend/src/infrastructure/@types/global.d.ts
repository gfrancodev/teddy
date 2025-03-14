namespace Auth {
  type User = {
    sub: string;
    username: string;
    email: string;
    role: string;
  };

  type Request<T> = {
    user: CurrentUser;
  } & T;
}

namespace Global {
  type PaginatedResult<T> = {
    current_page: number;
    total_pages: number;
    total_items: number;
    limit: number;
    in_page: number;
    has_next_page: boolean;
    has_previous_page: boolean;
    data: T[];
  };
}
