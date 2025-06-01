import ApiService from './api';
import { AuthResponse, LoginCredentials, RegisterData, User } from '../interface/api';
import { supabase } from '../lib/supabase';

class AuthService {
  static async login(credentials: LoginCredentials): Promise<any> {
      const { error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })
    if (error) return error.message;
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