export interface ApiError {
  success: false;
  error: {
    status: number;
    details: {
      code: number;
      description: string;
    };
  };
}

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
}

export interface IHttpProvider {
  get<T>(url: string, params?: object): Promise<ApiResponse<T>>;
  post<T>(url: string, data?: object): Promise<ApiResponse<T>>;
  put<T>(url: string, data?: object): Promise<ApiResponse<T>>;
  delete<T>(url: string): Promise<ApiResponse<T>>;
  setBearerToken(token: string): void;
  clearBearerToken(): void;
  hasBearerToken(): boolean;
}
