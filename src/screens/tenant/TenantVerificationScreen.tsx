import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, Text, View } from 'react-native';
import { AppButton } from '../../components/AppButton';
import { AppCard } from '../../components/AppCard';
import { AppInput } from '../../components/AppInput';
import { EmptyState } from '../../components/EmptyState';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SectionHeader } from '../../components/SectionHeader';
import { StatusBadge, toneForStatus } from '../../components/StatusBadge';
import { VerificationCard } from '../../components/VerificationCard';
import { createVerification, getMyVerifications } from '../../services/verifications/verificationApi';
import { colors } from '../../theme/colors';
import type { VerificationRequest } from '../../types';
import type { VerificationType } from '../../types/verification';
import { toUiVerification } from '../../types/verification';
import { getApiErrorMessage } from '../../utils/apiError';
import Screen from '../shared/Screen';

const types: VerificationType[] = ['identity', 'income', 'employment', 'bank', 'background'];

export default function TenantVerificationScreen() {
  const [verifications, setVerifications] = useState<VerificationRequest[]>([]);
  const [type, setType] = useState<VerificationType>('identity');
  const [documentUrl, setDocumentUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');

  const loadVerifications = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError('');
    try {
      const data = await getMyVerifications();
      setVerifications(data.map(toUiVerification));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to load verifications.'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadVerifications();
  }, [loadVerifications]);

  const submit = async () => {
    setSubmitting(true);
    setFormError('');
    setSuccess('');
    try {
      await createVerification({ type, documentUrl: documentUrl.trim(), notes: notes.trim() || undefined });
      setDocumentUrl('');
      setNotes('');
      setSuccess('Verification submitted.');
      await loadVerifications(true);
    } catch (err) {
      setFormError(getApiErrorMessage(err, 'Unable to submit verification.'));
    } finally {
      setSubmitting(false);
    }
  };

  const latestByType = types.map(item => verifications.find(v => v.type === item));

  return (
    <Screen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadVerifications(true)} />}>
      <ScreenHeader title="Verification" subtitle="Submit placeholder document URLs. Real upload comes later." />
      {success ? <Text style={{ color: colors.trust, fontWeight: '800' }}>{success}</Text> : null}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {latestByType.map((item, index) => (
          <AppCard key={types[index]} style={{ minWidth: '30%', flexGrow: 1 }}>
            <Text style={{ color: colors.text, fontWeight: '900', textTransform: 'capitalize' }}>{types[index]}</Text>
            <StatusBadge label={item?.status ?? 'pending'} tone={toneForStatus(item?.status ?? 'pending')} />
          </AppCard>
        ))}
      </View>
      <Text style={{ color: colors.muted }}>Verification improves your NivaasCred Score.</Text>
      <SectionHeader title="Submit verification" />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {types.map(item => (
          <AppButton key={item} title={item} onPress={() => setType(item)} variant={type === item ? 'primary' : 'ghost'} />
        ))}
      </View>
      <AppInput label="Document URL" value={documentUrl} onChangeText={setDocumentUrl} placeholder="https://example.com/document.pdf" />
      <AppInput label="Notes" value={notes} onChangeText={setNotes} placeholder="Aadhaar uploaded" />
      {formError ? <Text style={{ color: colors.danger }}>{formError}</Text> : null}
      <AppButton title={submitting ? 'Submitting...' : 'Submit verification'} onPress={submit} disabled={submitting} />
      <SectionHeader title="History" />
      {loading ? <LoadingSkeleton /> : null}
      {!loading && error ? <EmptyState title="Could not load verifications" message={error} actionLabel="Retry" onAction={() => loadVerifications()} /> : null}
      {!loading && !error && verifications.length === 0 ? <EmptyState title="No verifications yet" message="Submit your first verification request above." /> : null}
      {!loading && !error ? verifications.filter(v => !v.propertyTitle).map(item => <VerificationCard key={item.id} item={item} />) : null}
    </Screen>
  );
}
