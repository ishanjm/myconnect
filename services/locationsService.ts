import { apiClient } from '../utils/axiosConfig';
import { ILocation as Location, CreateLocationPayload, UpdateLocationPayload } from '@/model/Location';
import { from } from 'rxjs';

export function getLocationsApi() {
  return from(
    apiClient.get<{ locations: Location[] }>('/locations').then((res) => res.data)
  );
}

export function createLocationApi(payload: CreateLocationPayload) {
  return from(
    apiClient.post<{ location: Location }>('/locations', payload).then((res) => res.data)
  );
}

export function updateLocationApi(payload: UpdateLocationPayload) {
  const { id, ...data } = payload;
  return from(
    apiClient.put<{ location: Location }>(`/locations/${id}`, data).then((res) => res.data)
  );
}

export function deleteLocationApi(id: number) {
  return from(
    apiClient.delete(`/locations/${id}`).then((res) => res.data)
  );
}
