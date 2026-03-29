import { apiClient } from '../utils/axiosConfig';
import { LoginCredentials, RegisterCredentials, AuthResponse } from '@/model/auth';
import { from } from 'rxjs';

export function loginApi(credentials: LoginCredentials) {
  return from(
    apiClient.post<AuthResponse>('/auth/login', credentials).then((res) => res.data)
  );
}

export function registerApi(credentials: RegisterCredentials) {
  return from(
    apiClient.post<AuthResponse>('/auth/register', credentials).then((res) => res.data)
  );
}
