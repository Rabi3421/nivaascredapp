import { apiClient } from '../api/client';
import type { ApiProperty, PropertyFilters, PropertyPayload } from '../../types/property';

export async function getPublicProperties(filters: PropertyFilters = {}) {
  const sp = new URLSearchParams();
  if (filters.search) sp.set('search', filters.search);
  if (filters.city) sp.set('city', filters.city);
  if (filters.propertyType) sp.set('propertyType', filters.propertyType);
  if (filters.minRent !== undefined) sp.set('minRent', String(filters.minRent));
  if (filters.maxRent !== undefined) sp.set('maxRent', String(filters.maxRent));
  if (filters.page !== undefined) sp.set('page', String(filters.page));
  if (filters.limit !== undefined) sp.set('limit', String(filters.limit));
  const query = sp.toString();
  const res = await apiClient.get<{ properties: ApiProperty[]; pagination: unknown }>(
    `/properties${query ? `?${query}` : ''}`,
  );
  return res.data!;
}

export async function getPropertyById(id: string): Promise<ApiProperty> {
  const res = await apiClient.get<{ property: ApiProperty }>(`/properties/${id}`);
  return res.data!.property;
}

export async function getMyProperties(): Promise<ApiProperty[]> {
  const res = await apiClient.get<{ properties: ApiProperty[] }>('/landlord/properties');
  return res.data!.properties;
}

export async function createProperty(data: PropertyPayload): Promise<ApiProperty> {
  const res = await apiClient.post<{ property: ApiProperty }>('/landlord/properties', data);
  return res.data!.property;
}

export async function updateProperty(id: string, data: Partial<PropertyPayload>): Promise<ApiProperty> {
  const res = await apiClient.patch<{ property: ApiProperty }>(`/landlord/properties/${id}`, data);
  return res.data!.property;
}

export async function deleteProperty(id: string): Promise<void> {
  await apiClient.delete(`/landlord/properties/${id}`);
}
