export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string;
  created_at: string;
  updated_at: string;
  profile_image: string | null;
}

export interface FormDataLogin {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
}

export interface FormDataRegister {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  profile_image: File | null;
}
