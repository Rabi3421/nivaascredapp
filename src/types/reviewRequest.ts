export type ReviewRequestStatus = 'pending' | 'completed' | 'declined' | 'expired';

export interface ApiReviewRequestUser {
  _id: string;
  fullName: string;
  avatar?: string | null;
  role?: string;
}

export interface ApiReviewRequestProperty {
  _id: string;
  title: string;
  city?: string;
  state?: string;
  rentAmount?: number;
}

export interface ApiReviewRequestRentalHistory {
  _id: string;
  startDate?: string;
  endDate?: string | null;
  status?: string;
  monthlyRent?: number;
}

export interface ApiReviewRequest {
  _id: string;
  rentalHistoryId: ApiReviewRequestRentalHistory | string;
  requesterId: ApiReviewRequestUser | string;
  recipientId: string;
  propertyId: ApiReviewRequestProperty | string;
  reviewerRole: 'tenant' | 'landlord';
  status: ReviewRequestStatus;
  expiresAt?: string;
  createdAt: string;
}

export interface CreateReviewRequestPayload {
  rentalHistoryId: string;
  message?: string;
}

export interface UpdateReviewRequestPayload {
  status: Exclude<ReviewRequestStatus, 'pending'>;
}

export interface UiReviewRequest {
  id: string;
  rentalHistoryId: string;
  requesterName: string;
  propertyTitle: string;
  status: ReviewRequestStatus;
  createdAt: string;
}

export function toUiReviewRequest(request: ApiReviewRequest): UiReviewRequest {
  return {
    id: request._id,
    rentalHistoryId: typeof request.rentalHistoryId === 'object' ? request.rentalHistoryId._id : request.rentalHistoryId,
    requesterName: typeof request.requesterId === 'object' ? request.requesterId.fullName : 'Requester',
    propertyTitle: typeof request.propertyId === 'object' ? request.propertyId.title : 'Property',
    status: request.status,
    createdAt: request.createdAt,
  };
}
