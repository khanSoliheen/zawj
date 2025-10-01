import ApiService from './api';
import { AuthResponse, LoginCredentials, RegisterData, User } from '../interface/api';

class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return ApiService.post<AuthResponse>('/auth/login', credentials);
  }

  static async register(data: RegisterData): Promise<AuthResponse> {
    return ApiService.post<AuthResponse>('/auth/register', data);
  }

  static async logout(): Promise<void> {
    return ApiService.post('/auth/logout', {});
  }

  static async getCurrentUser(): Promise<User> {
    return ApiService.get<User>('/auth/me');
  }
}

export default AuthService; 