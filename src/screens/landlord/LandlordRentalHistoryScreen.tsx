import React from 'react';
import { AppButton } from '../../components/AppButton';
import { RentalHistoryCard } from '../../components/RentalHistoryCard';
import { ScreenHeader } from '../../components/ScreenHeader';
import { landlordRentalHistories } from '../../data/mockData';
import Screen from '../shared/Screen';

export default function LandlordRentalHistoryScreen() {
  return (
    <Screen>
      <ScreenHeader title="Rental history" subtitle="Manage active and completed rentals." />
      {landlordRentalHistories.map(item => (
        <React.Fragment key={item.id}>
          <RentalHistoryCard rental={item} counterpartyLabel="Tenant" />
          <AppButton title="Update status" variant="ghost" />
        </React.Fragment>
      ))}
    </Screen>
  );
}
