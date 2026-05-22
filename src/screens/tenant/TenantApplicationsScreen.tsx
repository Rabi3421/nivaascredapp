import React from 'react';
import { ApplicationCard } from '../../components/ApplicationCard';
import { EmptyState } from '../../components/EmptyState';
import { ScreenHeader } from '../../components/ScreenHeader';
import { applications } from '../../data/mockData';
import Screen from '../shared/Screen';

export default function TenantApplicationsScreen() {
  return (
    <Screen>
      <ScreenHeader title="Applications" subtitle="Track submitted applications and landlord decisions." />
      {applications.length === 0 ? (
        <EmptyState title="No applications yet" message="Apply for a property and it will appear here." />
      ) : (
        applications.map(item => <ApplicationCard key={item.id} application={item} />)
      )}
    </Screen>
  );
}
