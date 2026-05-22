import React from 'react';
import { Text } from 'react-native';
import { AppButton } from '../../components/AppButton';
import { ApplicationCard } from '../../components/ApplicationCard';
import { ScreenHeader } from '../../components/ScreenHeader';
import { applications } from '../../data/mockData';
import { colors } from '../../theme/colors';
import Screen from '../shared/Screen';

export default function LandlordTenantRequestsScreen() {
  return (
    <Screen>
      <ScreenHeader title="Tenant requests" subtitle="Approve, reject, shortlist, and create rental history." />
      {applications.map(item => (
        <React.Fragment key={item.id}>
          <ApplicationCard application={item} landlordActions />
          {item.status === 'approved' ? <AppButton title="Create rental history" variant="secondary" /> : null}
        </React.Fragment>
      ))}
      <Text style={{ color: colors.muted }}>Actions are UI-only until API integration.</Text>
    </Screen>
  );
}
