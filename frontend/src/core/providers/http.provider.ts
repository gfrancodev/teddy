import axios, { AxiosInstance } from 'axios';
import { LocalStorage } from '@brushy/localstorage';
import { ApiResponse, IHttpProvider } from '../interfaces/ihttp.provider';

export class HttpProvider implements IHttpProvider {
  private api: AxiosInstance;
  private storage: LocalStorage;
  private readonly TOKEN_KEY = '@token';

  constructor() {
    this.storage = new LocalStorage();

    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.api.interceptors.request.use((config) => {
      const token = this.storage.get<string>(this.TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.storage.remove(this.TOKEN_KEY);
          window.location.href = '/login';
        }
        return Promise.reject(error.response?.data || error);
      }
    );
  }

  /**
   * Sets the authentication token
   * @param token JWT token for authentication
   */
  setBearerToken(token: string): void {
    console.log(this.TOKEN_KEY, token, { ttl: 24 * 60 * 60 * 1000 })
    this.storage.set(this.TOKEN_KEY, token, { ttl: 24 * 60 * 60 * 1000 });
  }

  /**
   * Clears the authentication token
   */
  clearBearerToken(): void {
    this.storage.remove(this.TOKEN_KEY);
  }

  /**
   * Checks if a token is stored
   */
  hasBearerToken(): boolean {
    return !!this.storage.get<string>(this.TOKEN_KEY);
  }

  async get<T>(url: string, params?: object): Promise<ApiResponse<T>> {
    return await this.api.get(url, { params });
  }

  async post<T>(url: string, data?: object): Promise<ApiResponse<T>> {
    return await this.api.post(url, data);
  }

  async put<T>(url: string, data?: object) {
    return await this.api.put(url, data);
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    return await this.api.delete(url);
  }
}
