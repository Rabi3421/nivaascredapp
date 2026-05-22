import type { Application, ApplicationStatus } from './index';
import type { ApiProperty } from './property';
import { toUiProperty } from './property';

export interface ApiApplicationUser {
  _id: string;
  fullName: string;
  email?: string;
  phone?: string | null;
  avatar?: string | null;
}

export interface ApiApplicationTenantProfile {
  occupation?: string;
  monthlyIncome?: string;
  rentalScore?: number;
  verificationStatus?: Record<string, boolean>;
}

export interface ApiApplication {
  _id: string;
  propertyId: ApiProperty | string;
  tenantId: ApiApplicationUser | string;
  landlordId: ApiApplicationUser | string;
  status: ApplicationStatus;
  message: string;
  moveInDate?: string | null;
  rejectionReason?: string;
  interviewNotes?: string;
  approvedAt?: string | null;
  tenantProfile?: ApiApplicationTenantProfile | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApplyForPropertyPayload {
  propertyId: string;
  message?: string;
  moveInDate?: string;
}

export interface UpdateApplicationStatusPayload {
  status: 'pending' | 'shortlisted' | 'approved' | 'rejected';
  landlordNote?: string;
}

export function toUiApplication(application: ApiApplication): Application {
  const property =
    typeof application.propertyId === 'object'
      ? application.propertyId.address
        ? toUiProperty(application.propertyId)
        : {
            id: application.propertyId._id,
            title: application.propertyId.title,
            city: application.propertyId.city ?? '',
            state: application.propertyId.state,
            address: [application.propertyId.city, application.propertyId.state].filter(Boolean).join(', '),
            rentAmount: application.propertyId.rentAmount ?? 0,
            depositAmount: application.propertyId.depositAmount ?? 0,
            propertyType: application.propertyId.propertyType ?? '',
            furnishingStatus: application.propertyId.furnishingStatus?.replace('_', ' ') ?? '',
            bedrooms: application.propertyId.bedrooms ?? 0,
            bathrooms: application.propertyId.bathrooms ?? 0,
            amenities: application.propertyId.amenities ?? [],
            imageUrl: application.propertyId.images?.[0]?.url ?? 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
            landlordName: 'Landlord',
            landlordScore: 750,
            verificationStatus: 'pending' as const,
            status: application.propertyId.availabilityStatus ?? 'available',
          }
      : {
          id: application.propertyId,
          title: 'Property',
          city: '',
          address: '',
          rentAmount: 0,
          depositAmount: 0,
          propertyType: '',
          furnishingStatus: '',
          bedrooms: 0,
          bathrooms: 0,
          amenities: [],
          imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
          landlordName: 'Landlord',
          landlordScore: 750,
          verificationStatus: 'pending' as const,
          status: 'available' as const,
        };
  const tenant = typeof application.tenantId === 'object' ? application.tenantId : null;
  const landlord = typeof application.landlordId === 'object' ? application.landlordId : null;
  return {
    id: application._id,
    property,
    tenantName: tenant?.fullName ?? 'Tenant',
    landlordName: landlord?.fullName ?? property.landlordName,
    tenantEmail: tenant?.email,
    tenantPhone: tenant?.phone ?? undefined,
    moveInDate: application.moveInDate,
    rejectionReason: application.rejectionReason,
    interviewNotes: application.interviewNotes,
    tenantScore: application.tenantProfile?.rentalScore ?? 700,
    status: application.status,
    appliedAt: application.createdAt,
    message: application.message,
  };
}
