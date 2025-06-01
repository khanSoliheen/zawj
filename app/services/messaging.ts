import ApiService from './api';
import { AuthResponse, LoginCredentials, RegisterData, User } from '../interface/api';
import { supabase } from '../lib/supabase';

class AuthService {
  static async getMessages(): Promise<any> {
    // const { error } = await supabase.auth.signInWithPassword({
    //   email: credentials.email,
    //   password: credentials.password,
    // })
  }

  static async sendMessage(): Promise<any> {

  }
  static async newChat(): Promise<any> {
    
  }

}

export default AuthService; 