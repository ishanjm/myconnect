import { apiClient } from '../utils/axiosConfig';
import { LoginCredentials, AuthResponse } from '@/model/auth';
import { from } from 'rxjs';

export function loginApi(credentials: LoginCredentials) {
  return from(
    apiClient.post<AuthResponse>('/auth/login', credentials).then((res) => res.data)
  );
}
