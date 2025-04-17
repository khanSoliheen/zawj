export interface LanguageDetectorPlugin {
  type: 'languageDetector';
  async: boolean;
  detect: (_: (_: string) => void) => void;
  init: () => void;
  cacheUserLanguage: (_: string) => void;
}


export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  gender: 'male' | 'female';
  dateOfBirth: string;
  password: string;
  confirmPassword: string;
}
