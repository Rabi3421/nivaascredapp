import type {
  Application,
  Property,
  RentalHistory,
  Review,
  ScoreBreakdown,
  UserProfile,
  VerificationRequest,
} from '../types';

export const tenantProfile: UserProfile = {
  name: 'Rahul Kumar',
  email: 'rahul.kumar@example.com',
  phone: '+91 98765 43210',
  city: 'Bengaluru',
  role: 'tenant',
  score: 742,
  grade: 'Good',
  verifiedItems: 3,
  totalVerificationItems: 5,
};

export const landlordProfile: UserProfile = {
  name: 'Priya Sharma',
  email: 'priya.sharma@example.com',
  phone: '+91 98765 43211',
  city: 'Bengaluru',
  role: 'landlord',
  score: 781,
  grade: 'Good',
  verifiedItems: 3,
  totalVerificationItems: 4,
};

export const properties: Property[] = [
  {
    id: 'p1',
    title: 'Bright 2BHK near Metro',
    city: 'Bengaluru',
    address: 'Indiranagar, Bengaluru, Karnataka',
    rentAmount: 32000,
    depositAmount: 90000,
    propertyType: '2BHK',
    furnishingStatus: 'Semi furnished',
    bedrooms: 2,
    bathrooms: 2,
    amenities: ['Lift', 'Security', 'Balcony', 'Power backup'],
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
    landlordName: 'Priya Sharma',
    landlordScore: 781,
    verificationStatus: 'approved',
    status: 'available',
  },
  {
    id: 'p2',
    title: 'Quiet Studio in HSR Layout',
    city: 'Bengaluru',
    address: 'HSR Layout Sector 2, Bengaluru',
    rentAmount: 18500,
    depositAmount: 50000,
    propertyType: 'Studio',
    furnishingStatus: 'Fully furnished',
    bedrooms: 1,
    bathrooms: 1,
    amenities: ['WiFi ready', 'Security', 'Parking'],
    imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
    landlordName: 'Amit Rao',
    landlordScore: 724,
    verificationStatus: 'pending',
    status: 'available',
  },
  {
    id: 'p3',
    title: 'Family 3BHK with Park View',
    city: 'Pune',
    address: 'Baner, Pune, Maharashtra',
    rentAmount: 41000,
    depositAmount: 120000,
    propertyType: '3BHK',
    furnishingStatus: 'Unfurnished',
    bedrooms: 3,
    bathrooms: 3,
    amenities: ['Garden', 'Clubhouse', 'Covered parking'],
    imageUrl: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4',
    landlordName: 'Nisha Iyer',
    landlordScore: 804,
    verificationStatus: 'approved',
    status: 'rented',
  },
];

export const applications: Application[] = [
  {
    id: 'a1',
    property: properties[0],
    tenantName: tenantProfile.name,
    tenantScore: tenantProfile.score,
    status: 'approved',
    appliedAt: '2026-05-15',
    message: 'Looking for a long-term rental close to my office.',
  },
  {
    id: 'a2',
    property: properties[1],
    tenantName: tenantProfile.name,
    tenantScore: tenantProfile.score,
    status: 'shortlisted',
    appliedAt: '2026-05-18',
    message: 'Interested in moving in next month.',
  },
];

export const rentalHistories: RentalHistory[] = [
  {
    id: 'r1',
    property: properties[0],
    counterpartyName: 'Priya Sharma',
    counterpartyScore: 781,
    monthlyRent: 32000,
    depositAmount: 90000,
    startDate: '2026-06-01',
    endDate: '2027-05-31',
    status: 'active',
  },
  {
    id: 'r2',
    property: properties[2],
    counterpartyName: 'Nisha Iyer',
    counterpartyScore: 804,
    monthlyRent: 39000,
    depositAmount: 110000,
    startDate: '2024-06-01',
    endDate: '2025-05-31',
    status: 'completed',
  },
];

export const landlordRentalHistories: RentalHistory[] = rentalHistories.map(item => ({
  ...item,
  counterpartyName: 'Rahul Kumar',
  counterpartyScore: 742,
}));

export const reviews: Review[] = [
  {
    id: 'rv1',
    title: 'Reliable tenant',
    comment: 'Paid on time and kept the property in good condition.',
    rating: 5,
    from: 'Priya Sharma',
    to: 'Rahul Kumar',
    propertyTitle: properties[0].title,
    tags: ['On-time', 'Clean', 'Respectful'],
  },
  {
    id: 'rv2',
    title: 'Responsive landlord',
    comment: 'Handled maintenance quickly and communicated clearly.',
    rating: 4,
    from: 'Rahul Kumar',
    to: 'Priya Sharma',
    propertyTitle: properties[0].title,
    tags: ['Responsive', 'Helpful'],
  },
];

export const tenantScoreBreakdown: ScoreBreakdown[] = [
  { label: 'Reviews', points: 210, maxPoints: 250 },
  { label: 'Rental history', points: 105, maxPoints: 150 },
  { label: 'Applications', points: 72, maxPoints: 100 },
  { label: 'Verification', points: 55, maxPoints: 100 },
];

export const landlordScoreBreakdown: ScoreBreakdown[] = [
  { label: 'Reviews', points: 220, maxPoints: 250 },
  { label: 'Rental history', points: 115, maxPoints: 150 },
  { label: 'Property trust', points: 82, maxPoints: 100 },
  { label: 'Verification', points: 64, maxPoints: 100 },
];

export const verifications: VerificationRequest[] = [
  { id: 'v1', type: 'identity', status: 'approved', submittedAt: '2026-04-10' },
  { id: 'v2', type: 'income', status: 'pending', submittedAt: '2026-05-20' },
  {
    id: 'v3',
    type: 'property',
    status: 'approved',
    submittedAt: '2026-04-26',
    propertyTitle: properties[0].title,
  },
];
