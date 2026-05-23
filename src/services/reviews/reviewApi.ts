import { apiClient } from '../api/client';
import type { ApiReview, CreateReviewPayload } from '../../types/review';

export async function createReview(data: CreateReviewPayload): Promise<ApiReview> {
  const res = await apiClient.post<{ review: ApiReview }>('/reviews', data);
  return res.data!.review;
}

export async function getReceivedReviews(): Promise<ApiReview[]> {
  const res = await apiClient.get<{ reviews: ApiReview[] }>('/reviews/me');
  return res.data!.reviews;
}

export async function getGivenReviews(): Promise<ApiReview[]> {
  const res = await apiClient.get<{ reviews: ApiReview[] }>('/reviews/given');
  return res.data!.reviews;
}
