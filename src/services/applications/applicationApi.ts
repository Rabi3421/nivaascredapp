import { apiClient } from '../api/client';
import type {
  ApiApplication,
  ApplyForPropertyPayload,
  UpdateApplicationStatusPayload,
} from '../../types/application';

export async function applyForProperty(data: ApplyForPropertyPayload): Promise<ApiApplication> {
  const res = await apiClient.post<{ application: ApiApplication }>('/applications', data);
  return res.data!.application;
}

export async function getMyTenantApplications(): Promise<ApiApplication[]> {
  const res = await apiClient.get<{ applications: ApiApplication[] }>('/tenant/applications');
  return res.data!.applications;
}

export async function getLandlordApplications(): Promise<ApiApplication[]> {
  const res = await apiClient.get<{ applications: ApiApplication[] }>('/landlord/applications');
  return res.data!.applications;
}

export async function updateApplicationStatus(
  id: string,
  data: UpdateApplicationStatusPayload,
): Promise<ApiApplication> {
  const res = await apiClient.patch<{ application: ApiApplication }>(
    `/landlord/applications/${id}`,
    data,
  );
  return res.data!.application;
}
