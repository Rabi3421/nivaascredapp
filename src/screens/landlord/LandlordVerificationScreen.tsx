import React from 'react';
import { Text } from 'react-native';
import { AppButton } from '../../components/AppButton';
import { AppInput } from '../../components/AppInput';
import { PropertyCard } from '../../components/PropertyCard';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SectionHeader } from '../../components/SectionHeader';
import { VerificationCard } from '../../components/VerificationCard';
import { properties, verifications } from '../../data/mockData';
import { colors } from '../../theme/colors';
import Screen from '../shared/Screen';

export default function LandlordVerificationScreen() {
  return (
    <Screen>
      <ScreenHeader title="Verification" subtitle="Submit landlord and property documents." />
      <AppInput label="Verification type" placeholder="identity / bank / property" />
      <AppInput label="Document URL" placeholder="https://example.com/document.pdf" />
      <AppButton title="Submit landlord verification" />
      <SectionHeader title="Property verification" />
      {properties.slice(0, 2).map(property => (
        <React.Fragment key={property.id}>
          <PropertyCard property={property} compact />
          <AppButton title="Request property verification" variant="outline" />
        </React.Fragment>
      ))}
      <Text style={{ color: colors.muted }}>TODO: connect to `/api/landlord/properties/[id]/verification`.</Text>
      <SectionHeader title="History" />
      {verifications.map(item => <VerificationCard key={item.id} item={item} />)}
    </Screen>
  );
}
