export interface IAuthService {
  login(data: Auth.LoginDTO): Promise<Auth.LoginResponse>;
  register(data: Auth.RegisterDTO): Promise<void>;
  logout(): void;
  isAuthenticated(): boolean;
  me(): Promise<Auth.UserResponse>;
  setBearerToken(token: string): void;
}
