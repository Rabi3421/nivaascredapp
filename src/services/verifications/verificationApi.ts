import { apiClient } from '../api/client';
import type { ApiVerification, CreateVerificationPayload, PropertyVerificationPayload } from '../../types/verification';

export async function createVerification(data: CreateVerificationPayload): Promise<ApiVerification> {
  const res = await apiClient.post<{ verification: ApiVerification }>('/verifications', data);
  return res.data!.verification;
}

export async function getMyVerifications(): Promise<ApiVerification[]> {
  const res = await apiClient.get<{ verifications: ApiVerification[] }>('/verifications/me');
  return res.data!.verifications;
}

export async function requestPropertyVerification(propertyId: string, data: PropertyVerificationPayload): Promise<ApiVerification> {
  const res = await apiClient.post<{ verification: ApiVerification }>(`/landlord/properties/${propertyId}/verification`, data);
  return res.data!.verification;
}
