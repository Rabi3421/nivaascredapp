import type { Property } from './index';

export interface ApiPropertyImage {
  url: string;
  alt?: string;
  isPrimary: boolean;
}

export interface ApiPropertyAddress {
  line1: string;
  line2?: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
}

export interface ApiPropertyLandlord {
  _id: string;
  fullName: string;
  avatar?: string | null;
  isEmailVerified?: boolean;
}

export interface ApiProperty {
  _id: string;
  landlordId: ApiPropertyLandlord | string;
  title: string;
  description: string;
  address: ApiPropertyAddress;
  city: string;
  state: string;
  pincode: string;
  rentAmount: number;
  depositAmount: number;
  maintenanceCharges?: number;
  propertyType: '1BHK' | '2BHK' | '3BHK' | '4BHK' | 'Studio' | 'Villa' | 'PG';
  furnishingStatus: 'unfurnished' | 'semi_furnished' | 'fully_furnished';
  bedrooms: number;
  bathrooms: number;
  areaSqFt?: number;
  images: ApiPropertyImage[];
  amenities: string[];
  preferredTenants: string[];
  petsAllowed: boolean;
  availabilityStatus: 'available' | 'rented' | 'inactive' | 'pending_review';
  verificationStatus?: 'unverified' | 'pending' | 'approved' | 'rejected';
  averageRating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFilters {
  search?: string;
  city?: string;
  propertyType?: string;
  minRent?: number;
  maxRent?: number;
  page?: number;
  limit?: number;
}

export interface PropertyPayload {
  title: string;
  description: string;
  address: ApiPropertyAddress;
  rentAmount: number;
  depositAmount: number;
  propertyType: ApiProperty['propertyType'];
  furnishingStatus: ApiProperty['furnishingStatus'];
  bedrooms: number;
  bathrooms: number;
  images?: ApiPropertyImage[];
  amenities?: string[];
  preferredTenants?: string[];
  petsAllowed?: boolean;
  availabilityStatus?: ApiProperty['availabilityStatus'];
}

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267';

export function toUiProperty(property: ApiProperty): Property {
  const landlord = typeof property.landlordId === 'object' ? property.landlordId : null;
  const primaryImage = property.images?.find(image => image.isPrimary) ?? property.images?.[0];
  const verificationStatus = property.verificationStatus === 'approved' ? 'approved' : property.verificationStatus === 'rejected' ? 'rejected' : 'pending';
  return {
    id: property._id,
    title: property.title,
    description: property.description,
    city: property.city,
    state: property.state,
    pincode: property.pincode,
    address: `${property.address.line1}, ${property.address.locality}, ${property.city}, ${property.state} - ${property.pincode}`,
    rentAmount: property.rentAmount,
    depositAmount: property.depositAmount,
    propertyType: property.propertyType,
    furnishingStatus: property.furnishingStatus.replace('_', ' '),
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    amenities: property.amenities ?? [],
    imageUrl: primaryImage?.url ?? PLACEHOLDER_IMAGE,
    landlordName: landlord?.fullName ?? 'Landlord',
    landlordScore: 750,
    verificationStatus,
    status: property.availabilityStatus,
  };
}
