import ApiService from './api';
import { UpdateProfileData, User } from '../interface/api';

class UserService {
  static async getProfile(): Promise<User> {
    return ApiService.get<User>('/user/profile');
  }

  static async updateProfile(data: UpdateProfileData): Promise<User> {
    return ApiService.put<User>('/user/profile', data);
  }
}

export default UserService; 