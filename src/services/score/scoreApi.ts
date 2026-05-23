import { apiClient } from '../api/client';
import type { ApiScore } from '../../types/score';

export async function getMyScore(): Promise<ApiScore> {
  const res = await apiClient.get<ApiScore>('/score/me');
  return res.data!;
}

export async function recalculateMyScore(): Promise<ApiScore> {
  const res = await apiClient.post<ApiScore>('/score/recalculate');
  return res.data!;
}
