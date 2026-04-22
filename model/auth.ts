import { SubscriptionType } from "@/common/auth.constants";

export type UserRole = 'super admin' | 'group admin' | 'member';

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterCredentials extends LoginCredentials {
  firstName: string;
  lastName: string;
  subscription: SubscriptionType;
  address?: string;
  mobileNumber?: string;
  profileImage?: string;
}

export interface AuthUser {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  subscription?: SubscriptionType;
  profileImage?: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}
