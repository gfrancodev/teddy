declare namespace Auth {
  interface ContextType {
    user: UserResponse | null;
    isAuthenticated: boolean;
    login: (credentials: LoginDTO) => void;
    register: (data: RegisterDTO) => void;
    logout: () => void;
    updateUser: (updates: Partial<UserResponse>) => void;
    isLoading: boolean;
    isAuthenticating: boolean;
    error: Error | null;
  }

  interface LoginDTO {
    identifier: string;
    password: string;
  }

  interface LoginResponse {
    access_token: string;
    expires_in: number;
    user: {
      fullname: string;
      username: string;
      email: string;
    };
  }

  interface RegisterDTO {
    fullname: string;
    email: string;
    username: string;
    password: string;
  }

  interface UserResponse {
    id: string;
    fullname: string;
    email: string;
    username: string;
    last_access: string | null;
    status: string;
    role: string;
    verified: boolean;
    created_at: string | null;
    updated_at: string | null;
    deleted_at: string | null;
  }

  interface CurrentUser {
    id: string;
    fullname: string;
    email: string;
    username: string;
    role: string;
  }
}

export = Auth;
export as namespace Auth;
