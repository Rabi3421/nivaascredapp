import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl } from 'react-native';
import { ApplicationCard } from '../../components/ApplicationCard';
import { EmptyState } from '../../components/EmptyState';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { ScreenHeader } from '../../components/ScreenHeader';
import { getMyTenantApplications } from '../../services/applications/applicationApi';
import type { Application } from '../../types';
import { toUiApplication } from '../../types/application';
import { getApiErrorMessage } from '../../utils/apiError';
import Screen from '../shared/Screen';

export default function TenantApplicationsScreen() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadApplications = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError('');
    try {
      const data = await getMyTenantApplications();
      setApplications(data.map(toUiApplication));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to load applications.'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  return (
    <Screen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadApplications(true)} />}>
      <ScreenHeader title="Applications" subtitle="Track submitted applications and landlord decisions." />
      {loading ? <LoadingSkeleton /> : null}
      {!loading && error ? (
        <EmptyState title="Could not load applications" message={error} actionLabel="Retry" onAction={() => loadApplications()} />
      ) : null}
      {!loading && !error && applications.length === 0 ? (
        <EmptyState title="No applications yet" message="Apply for a property and it will appear here." />
      ) : null}
      {!loading && !error ? (
        applications.map(item => <ApplicationCard key={item.id} application={item} />)
      ) : null}
    </Screen>
  );
}
