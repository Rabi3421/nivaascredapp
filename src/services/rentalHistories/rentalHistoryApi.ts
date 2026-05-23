import { apiClient } from '../api/client';
import type { ApiRentalHistory, CreateRentalHistoryPayload, UpdateRentalHistoryPayload } from '../../types/rentalHistory';

export async function getTenantRentalHistories(): Promise<ApiRentalHistory[]> {
  const res = await apiClient.get<{ rentalHistories: ApiRentalHistory[] }>('/tenant/rental-histories');
  return res.data!.rentalHistories;
}

export async function getLandlordRentalHistories(): Promise<ApiRentalHistory[]> {
  const res = await apiClient.get<{ rentalHistories: ApiRentalHistory[] }>('/landlord/rental-histories');
  return res.data!.rentalHistories;
}

export async function createRentalHistory(data: CreateRentalHistoryPayload): Promise<ApiRentalHistory> {
  const res = await apiClient.post<{ rentalHistory: ApiRentalHistory }>('/landlord/rental-histories', data);
  return res.data!.rentalHistory;
}

export async function updateRentalHistory(id: string, data: UpdateRentalHistoryPayload): Promise<ApiRentalHistory> {
  const res = await apiClient.patch<{ rentalHistory: ApiRentalHistory }>(`/landlord/rental-histories/${id}`, data);
  return res.data!.rentalHistory;
}
