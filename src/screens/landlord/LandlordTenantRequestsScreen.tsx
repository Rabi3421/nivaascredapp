import React, { useCallback, useEffect, useState } from 'react';
import { Alert, RefreshControl, Text, View } from 'react-native';
import { AppButton } from '../../components/AppButton';
import { ApplicationCard } from '../../components/ApplicationCard';
import { AppInput } from '../../components/AppInput';
import { EmptyState } from '../../components/EmptyState';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { ScreenHeader } from '../../components/ScreenHeader';
import { getLandlordApplications, updateApplicationStatus } from '../../services/applications/applicationApi';
import { createRentalHistory } from '../../services/rentalHistories/rentalHistoryApi';
import { colors } from '../../theme/colors';
import type { Application, ApplicationStatus, RentalStatus } from '../../types';
import { toUiApplication } from '../../types/application';
import { getApiErrorMessage } from '../../utils/apiError';
import Screen from '../shared/Screen';
import { ModalSheet } from '../shared/ModalSheet';

const initialRentalForm = {
  startDate: '',
  endDate: '',
  monthlyRent: '',
  depositAmount: '',
  status: 'active' as RentalStatus,
};

export default function LandlordTenantRequestsScreen() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [rentalApplication, setRentalApplication] = useState<Application | null>(null);
  const [rentalForm, setRentalForm] = useState(initialRentalForm);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState('');
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');

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
    setSuccess('');
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

  const openRentalHistory = (application: Application) => {
    setRentalApplication(application);
    setRentalForm({
      startDate: new Date().toISOString().slice(0, 10),
      endDate: '',
      monthlyRent: String(application.property.rentAmount || ''),
      depositAmount: String(application.property.depositAmount || ''),
      status: 'active',
    });
    setFormError('');
  };

  const submitRentalHistory = async () => {
    if (!rentalApplication) return;
    const monthlyRent = Number(rentalForm.monthlyRent);
    const depositAmount = Number(rentalForm.depositAmount);
    if (!rentalForm.startDate || Number.isNaN(monthlyRent) || Number.isNaN(depositAmount)) {
      setFormError('Start date, monthly rent, and deposit are required.');
      return;
    }
    setUpdatingId(rentalApplication.id);
    setFormError('');
    setSuccess('');
    try {
      await createRentalHistory({
        applicationId: rentalApplication.id,
        startDate: rentalForm.startDate,
        endDate: rentalForm.endDate || undefined,
        monthlyRent,
        depositAmount,
        status: rentalForm.status,
      });
      setSuccess('Rental history created successfully.');
      setRentalApplication(null);
      setRentalForm(initialRentalForm);
      await loadApplications(true);
    } catch (err) {
      setFormError(getApiErrorMessage(err, 'Unable to create rental history.'));
    } finally {
      setUpdatingId('');
    }
  };

  return (
    <Screen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadApplications(true)} />}>
      <ScreenHeader title="Tenant requests" subtitle="Approve, reject, shortlist, and create rental history." />
      {success ? <Text style={{ color: colors.trust, fontWeight: '800' }}>{success}</Text> : null}
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
            {item.status === 'approved' ? <AppButton title="Create rental history" onPress={() => openRentalHistory(item)} disabled={updatingId === item.id} variant="secondary" /> : null}
          </React.Fragment>
        ))
      ) : null}
      <ModalSheet visible={Boolean(rentalApplication)} title="Create rental history" onClose={() => setRentalApplication(null)}>
        <AppInput label="Start date" value={rentalForm.startDate} onChangeText={value => setRentalForm(current => ({ ...current, startDate: value }))} placeholder="YYYY-MM-DD" />
        <AppInput label="End date" value={rentalForm.endDate} onChangeText={value => setRentalForm(current => ({ ...current, endDate: value }))} placeholder="YYYY-MM-DD" />
        <AppInput label="Monthly rent" value={rentalForm.monthlyRent} onChangeText={value => setRentalForm(current => ({ ...current, monthlyRent: value }))} keyboardType="number-pad" />
        <AppInput label="Deposit" value={rentalForm.depositAmount} onChangeText={value => setRentalForm(current => ({ ...current, depositAmount: value }))} keyboardType="number-pad" />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {(['active', 'completed', 'terminated'] as RentalStatus[]).map(status => (
            <AppButton key={status} title={status} onPress={() => setRentalForm(current => ({ ...current, status }))} variant={rentalForm.status === status ? 'secondary' : 'ghost'} style={{ flex: 1 }} />
          ))}
        </View>
        {formError ? <Text style={{ color: colors.danger }}>{formError}</Text> : null}
        <AppButton title={updatingId ? 'Creating...' : 'Create rental history'} onPress={submitRentalHistory} disabled={Boolean(updatingId)} />
      </ModalSheet>
    </Screen>
  );
}
