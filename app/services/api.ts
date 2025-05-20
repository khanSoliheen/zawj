import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiError, ApiResponse } from '../interface/api';

const BASE_URL = 'YOUR_API_BASE_URL';

class ApiService {
  private static async getHeaders(): Promise<HeadersInit> {
    const token = await AsyncStorage.getItem('@auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  private static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || 'Something went wrong');
    }
    return response.json();
  }

  static async get<T>(endpoint: string): Promise<T> {
    const headers = await this.getHeaders();
    const response = await fetch(`${BASE_URL}${endpoint}`, { headers });
    return this.handleResponse<T>(response);
  }

  static async post<T>(endpoint: string, data: any): Promise<T> {
    const headers = await this.getHeaders();
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  static async put<T>(endpoint: string, data: any): Promise<T> {
    const headers = await this.getHeaders();
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  static async delete<T>(endpoint: string): Promise<T> {
    const headers = await this.getHeaders();
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });
    return this.handleResponse<T>(response);
  }
}

export default ApiService; 