import { apiClient } from '../api/client';
import type { ApiReviewRequest, CreateReviewRequestPayload, UpdateReviewRequestPayload } from '../../types/reviewRequest';

export async function createReviewRequest(data: CreateReviewRequestPayload): Promise<ApiReviewRequest> {
  const res = await apiClient.post<{ reviewRequest: ApiReviewRequest }>('/review-requests', data);
  return res.data!.reviewRequest;
}

export async function getReviewRequests(): Promise<ApiReviewRequest[]> {
  const res = await apiClient.get<{ reviewRequests: ApiReviewRequest[] }>('/review-requests');
  return res.data!.reviewRequests;
}

export async function updateReviewRequestStatus(id: string, data: UpdateReviewRequestPayload): Promise<ApiReviewRequest> {
  const res = await apiClient.patch<{ reviewRequest: ApiReviewRequest }>(`/review-requests/${id}`, data);
  return res.data!.reviewRequest;
}
