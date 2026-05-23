import type { Property, RentalHistory, RentalStatus } from './index';

export interface ApiRentalUser {
  _id: string;
  fullName: string;
  email?: string;
  phone?: string | null;
  avatar?: string | null;
}

export interface ApiRentalProperty {
  _id: string;
  title: string;
  city?: string;
  state?: string;
  rentAmount?: number;
  images?: { url: string; alt?: string; isPrimary?: boolean }[];
}

export interface ApiRentalHistory {
  _id: string;
  applicationId?: string;
  tenantId: ApiRentalUser | string;
  landlordId: ApiRentalUser | string;
  propertyId: ApiRentalProperty | string;
  monthlyRent: number;
  depositAmount: number;
  startDate: string;
  endDate?: string | null;
  status: RentalStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRentalHistoryPayload {
  applicationId: string;
  startDate: string;
  endDate?: string;
  monthlyRent: number;
  depositAmount: number;
  status: RentalStatus;
}

export interface UpdateRentalHistoryPayload {
  startDate?: string;
  endDate?: string | null;
  monthlyRent?: number;
  depositAmount?: number;
  status?: RentalStatus;
}

const fallbackImage = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267';

function propertyFromSummary(property: ApiRentalProperty | string): Property {
  if (typeof property === 'string') {
    return {
      id: property,
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
      imageUrl: fallbackImage,
      landlordName: 'Landlord',
      landlordScore: 750,
      verificationStatus: 'pending',
      status: 'available',
    };
  }

  return {
    id: property._id,
    title: property.title,
    city: property.city ?? '',
    state: property.state,
    address: [property.city, property.state].filter(Boolean).join(', '),
    rentAmount: property.rentAmount ?? 0,
    depositAmount: 0,
    propertyType: '',
    furnishingStatus: '',
    bedrooms: 0,
    bathrooms: 0,
    amenities: [],
    imageUrl: property.images?.[0]?.url ?? fallbackImage,
    landlordName: 'Landlord',
    landlordScore: 750,
    verificationStatus: 'pending',
    status: 'available',
  };
}

export function toUiRentalHistory(history: ApiRentalHistory, counterparty: 'landlord' | 'tenant'): RentalHistory {
  const person = counterparty === 'landlord' ? history.landlordId : history.tenantId;
  const counterpartyName = typeof person === 'object' ? person.fullName : counterparty === 'landlord' ? 'Landlord' : 'Tenant';

  return {
    id: history._id,
    property: propertyFromSummary(history.propertyId),
    counterpartyName,
    counterpartyScore: 750,
    monthlyRent: history.monthlyRent,
    depositAmount: history.depositAmount,
    startDate: history.startDate,
    endDate: history.endDate ?? undefined,
    status: history.status,
  };
}
