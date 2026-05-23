import type { Review } from './index';

export interface ApiReviewUser {
  _id: string;
  fullName: string;
  avatar?: string | null;
  role?: string;
}

export interface ApiReviewProperty {
  _id: string;
  title: string;
  city?: string;
  state?: string;
}

export interface ApiReview {
  _id: string;
  rentalHistoryId: string;
  propertyId: ApiReviewProperty | string;
  reviewerId: ApiReviewUser | string;
  revieweeId: ApiReviewUser | string;
  reviewerRole: 'tenant' | 'landlord';
  revieweeRole: 'tenant' | 'landlord';
  rating: number;
  title: string;
  comment: string;
  tags: string[];
  createdAt: string;
}

export interface CreateReviewPayload {
  rentalHistoryId: string;
  rating: number;
  title: string;
  comment: string;
  tags?: string[];
}

export function toUiReview(review: ApiReview, mode: 'received' | 'given'): Review {
  const person = mode === 'received' ? review.reviewerId : review.revieweeId;
  const name = typeof person === 'object' ? person.fullName : mode === 'received' ? 'Reviewer' : 'Reviewee';
  const property = typeof review.propertyId === 'object' ? review.propertyId.title : 'Property';
  return {
    id: review._id,
    title: review.title,
    comment: review.comment,
    rating: review.rating,
    from: mode === 'received' ? name : `To ${name}`,
    to: mode === 'received' ? 'You' : name,
    propertyTitle: property,
    tags: review.tags ?? [],
  };
}
