import type { VerificationRequest, VerificationStatus } from './index';

export type VerificationType = 'identity' | 'income' | 'employment' | 'property' | 'background' | 'bank';

export interface ApiVerificationProperty {
  _id: string;
  title: string;
  city?: string;
  state?: string;
  verificationStatus?: string;
}

export interface ApiVerification {
  _id: string;
  type: VerificationType;
  status: VerificationStatus | 'expired';
  propertyId?: ApiVerificationProperty | string | null;
  submittedAt?: string;
  createdAt: string;
  rejectionReason?: string;
}

export interface CreateVerificationPayload {
  type: VerificationType;
  documentUrl: string;
  notes?: string;
}

export interface PropertyVerificationPayload {
  documentUrl: string;
  notes?: string;
}

export function toUiVerification(verification: ApiVerification): VerificationRequest {
  return {
    id: verification._id,
    type: verification.type,
    status: verification.status === 'expired' ? 'rejected' : verification.status,
    submittedAt: verification.submittedAt ?? verification.createdAt,
    propertyTitle: typeof verification.propertyId === 'object' && verification.propertyId ? verification.propertyId.title : undefined,
  };
}
