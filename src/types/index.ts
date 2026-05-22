export type UserRole = 'tenant' | 'landlord';

export type ApplicationStatus = 'pending' | 'shortlisted' | 'approved' | 'rejected';
export type RentalStatus = 'active' | 'completed' | 'terminated';
export type VerificationStatus = 'pending' | 'approved' | 'rejected' | 'under_review';

export interface ScoreBreakdown {
  label: string;
  points: number;
  maxPoints: number;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  city: string;
  role: UserRole;
  score: number;
  grade: string;
  verifiedItems: number;
  totalVerificationItems: number;
}

export interface Property {
  id: string;
  title: string;
  city: string;
  address: string;
  rentAmount: number;
  depositAmount: number;
  propertyType: string;
  furnishingStatus: string;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  imageUrl: string;
  landlordName: string;
  landlordScore: number;
  verificationStatus: VerificationStatus;
  status: 'available' | 'rented';
}

export interface Application {
  id: string;
  property: Property;
  tenantName: string;
  tenantScore: number;
  status: ApplicationStatus;
  appliedAt: string;
  message: string;
}

export interface RentalHistory {
  id: string;
  property: Property;
  counterpartyName: string;
  counterpartyScore: number;
  monthlyRent: number;
  depositAmount: number;
  startDate: string;
  endDate?: string;
  status: RentalStatus;
}

export interface Review {
  id: string;
  title: string;
  comment: string;
  rating: number;
  from: string;
  to: string;
  propertyTitle: string;
  tags: string[];
}

export interface VerificationRequest {
  id: string;
  type: string;
  status: VerificationStatus;
  submittedAt: string;
  propertyTitle?: string;
}
