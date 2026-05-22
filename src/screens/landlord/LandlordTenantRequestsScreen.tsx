import React, { useCallback, useEffect, useState } from 'react';
import { Alert, RefreshControl } from 'react-native';
import { AppButton } from '../../components/AppButton';
import { ApplicationCard } from '../../components/ApplicationCard';
import { EmptyState } from '../../components/EmptyState';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { ScreenHeader } from '../../components/ScreenHeader';
import { getLandlordApplications, updateApplicationStatus } from '../../services/applications/applicationApi';
import type { Application, ApplicationStatus } from '../../types';
import { toUiApplication } from '../../types/application';
import { getApiErrorMessage } from '../../utils/apiError';
import Screen from '../shared/Screen';

export default function LandlordTenantRequestsScreen() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState('');
  const [error, setError] = useState('');

  const loadApplications = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError('');
    try {
      const data = await getLandlordApplications();
      setApplications(data.map(toUiApplication));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to load tenant requests.'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const changeStatus = async (id: string, status: ApplicationStatus) => {
    setUpdatingId(id);
    setError('');
    try {
      await updateApplicationStatus(id, { status });
      await loadApplications(true);
    } catch (err) {
      setError(getApiErrorMessage(err, `Unable to mark application as ${status}.`));
    } finally {
      setUpdatingId('');
    }
  };

  const confirmStatus = (application: Application, status: ApplicationStatus) => {
    const title = status === 'approved' ? 'Approve tenant?' : status === 'rejected' ? 'Reject application?' : 'Shortlist tenant?';
    const message =
      status === 'approved'
        ? 'Approving this tenant may auto-reject other pending applications for the same property.'
        : `This will mark ${application.tenantName}'s application as ${status}.`;

    if (status === 'shortlisted') {
      changeStatus(application.id, status);
      return;
    }

    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel' },
      { text: status === 'rejected' ? 'Reject' : 'Approve', style: status === 'rejected' ? 'destructive' : 'default', onPress: () => changeStatus(application.id, status) },
    ]);
  };

  return (
    <Screen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadApplications(true)} />}>
      <ScreenHeader title="Tenant requests" subtitle="Approve, reject, shortlist, and create rental history." />
      {loading ? <LoadingSkeleton /> : null}
      {!loading && error ? (
        <EmptyState title="Could not load requests" message={error} actionLabel="Retry" onAction={() => loadApplications()} />
      ) : null}
      {!loading && !error && applications.length === 0 ? (
        <EmptyState title="No tenant requests yet" message="Applications for your properties will appear here." />
      ) : null}
      {!loading && !error ? (
        applications.map(item => (
          <React.Fragment key={item.id}>
            <ApplicationCard
              application={item}
              landlordActions
              actionsDisabled={updatingId === item.id}
              onShortlist={() => confirmStatus(item, 'shortlisted')}
              onApprove={() => confirmStatus(item, 'approved')}
              onReject={() => confirmStatus(item, 'rejected')}
            />
            {item.status === 'approved' ? <AppButton title="Create rental history in next phase" variant="secondary" disabled /> : null}
          </React.Fragment>
        ))
      ) : null}
    </Screen>
  );
}
