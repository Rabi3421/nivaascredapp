import React from 'react';
import { RentalHistoryCard } from '../../components/RentalHistoryCard';
import { ScreenHeader } from '../../components/ScreenHeader';
import { rentalHistories } from '../../data/mockData';
import Screen from '../shared/Screen';

export default function TenantRentalHistoryScreen() {
  return (
    <Screen>
      <ScreenHeader title="Rental history" subtitle="Confirmed rentals build your trust profile." />
      {rentalHistories.map(item => <RentalHistoryCard key={item.id} rental={item} counterpartyLabel="Landlord" />)}
    </Screen>
  );
}
