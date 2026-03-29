export type UserRole = 'super admin' | 'group admin' | 'member';

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export interface AuthUser {
  id: number;
  email: string;
  name?: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}
