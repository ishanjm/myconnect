import { apiClient } from '../utils/axiosConfig';
import { LoginCredentials, RegisterCredentials, AuthResponse } from '@/model/auth';
import { from } from 'rxjs';

export function loginApi(credentials: LoginCredentials) {
  return from(
    apiClient.post<AuthResponse>('/auth/login', credentials).then((res) => res.data)
  );
}

export function registerApi(credentials: any) {
  return from(
    apiClient.post<AuthResponse>('/auth/register', credentials).then((res) => res.data)
  );
}

export function logoutApi() {
  return from(
    apiClient.post('/auth/logout').then((res) => res.data)
  );
}

export function meApi() {
  return from(
    apiClient.get('/auth/me').then((res) => res.data)
  );
}
