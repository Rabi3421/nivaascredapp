import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type AuthStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type TenantStackParamList = {
  TenantTabs: undefined;
  PropertyDetails: { propertyId: string };
  TenantRentalHistory: undefined;
  TenantReviews: undefined;
  TenantVerification: undefined;
};

export type TenantTabParamList = {
  TenantHome: undefined;
  PropertyList: undefined;
  TenantApplications: undefined;
  TenantScore: undefined;
  TenantProfile: undefined;
};

export type LandlordStackParamList = {
  LandlordTabs: undefined;
  AddEditProperty: { propertyId?: string } | undefined;
  LandlordRentalHistory: undefined;
  LandlordReviews: undefined;
  LandlordVerification: undefined;
};

export type LandlordTabParamList = {
  LandlordHome: undefined;
  LandlordProperties: undefined;
  LandlordTenantRequests: undefined;
  LandlordScore: undefined;
  LandlordProfile: undefined;
};

export type AuthScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;
