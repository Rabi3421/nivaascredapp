import React from 'react';
import { AppButton } from '../../components/AppButton';
import { AppInput } from '../../components/AppInput';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SectionHeader } from '../../components/SectionHeader';
import { VerificationCard } from '../../components/VerificationCard';
import { verifications } from '../../data/mockData';
import Screen from '../shared/Screen';

export default function TenantVerificationScreen() {
  return (
    <Screen>
      <ScreenHeader title="Verification" subtitle="Submit placeholder document URLs. Real upload comes later." />
      <AppInput label="Verification type" placeholder="identity / income / bank" />
      <AppInput label="Document URL" placeholder="https://example.com/document.pdf" />
      <AppInput label="Notes" placeholder="Aadhaar uploaded" />
      <AppButton title="Submit verification" />
      <SectionHeader title="History" />
      {verifications.filter(v => !v.propertyTitle).map(item => <VerificationCard key={item.id} item={item} />)}
    </Screen>
  );
}
