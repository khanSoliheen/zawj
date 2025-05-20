export interface User {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  avatarUrl: string;
  gender: 'Male' | 'Female';
  bio: string;
} 