import { IHttpProvider } from '@/core/interfaces/ihttp.provider';

export class AuthService {
  private readonly baseUrl = '/v1/auth';

  constructor(private readonly httpProvider: IHttpProvider) {}

  /**
   * Authenticates user with credentials
   */
  async login(data: Auth.LoginDTO): Promise<Auth.LoginResponse> {
    try {
      const response = await this.httpProvider.post<Auth.LoginResponse>(
        `${this.baseUrl}/login`,
        data
      );
      this.httpProvider.setBearerToken(response.data.access_token);
      return response.data;
    } catch (error) {
      throw new Error('Credenciais inválidas');
    }
  }

  /**
   * Registers a new user
   */
  async register(data: Auth.RegisterDTO): Promise<void> {
    try {
      await this.httpProvider.post(`${this.baseUrl}/register`, data);
    } catch (error) {
      throw new Error('Falha ao registrar usuário');
    }
  }

  /**
   * Logs out the current user
   */
  logout(): void {
    this.httpProvider.clearBearerToken();
  }

  /**
   * Checks if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.httpProvider.hasBearerToken();
  }

  /**
   * Obtém os dados do usuário autenticado
   */
  async me(): Promise<Auth.UserResponse> {
    try {
      const response = await this.httpProvider.get<Auth.UserResponse>(
        `${this.baseUrl}/me`
      );
      return response.data;
    } catch (error) {
      throw new Error('Falha ao obter dados do usuário');
    }
  }

  /**
   * Define o token de autenticação
   */
  setBearerToken(token: string): void {
    console.log({ token })
    this.httpProvider.setBearerToken(token);
  }
}
