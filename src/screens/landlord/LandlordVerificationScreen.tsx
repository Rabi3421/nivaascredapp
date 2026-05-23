import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, Text, View } from 'react-native';
import { AppButton } from '../../components/AppButton';
import { AppInput } from '../../components/AppInput';
import { EmptyState } from '../../components/EmptyState';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { PropertyCard } from '../../components/PropertyCard';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SectionHeader } from '../../components/SectionHeader';
import { VerificationCard } from '../../components/VerificationCard';
import { getMyProperties } from '../../services/properties/propertyApi';
import { createVerification, getMyVerifications, requestPropertyVerification } from '../../services/verifications/verificationApi';
import { colors } from '../../theme/colors';
import type { Property, VerificationRequest } from '../../types';
import { toUiProperty } from '../../types/property';
import type { VerificationType } from '../../types/verification';
import { toUiVerification } from '../../types/verification';
import { getApiErrorMessage } from '../../utils/apiError';
import Screen from '../shared/Screen';

const types: VerificationType[] = ['identity', 'bank', 'background'];

export default function LandlordVerificationScreen() {
  const [verifications, setVerifications] = useState<VerificationRequest[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [type, setType] = useState<VerificationType>('identity');
  const [documentUrl, setDocumentUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [propertyDocumentUrl, setPropertyDocumentUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState('');
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');

  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError('');
    try {
      const [verificationData, propertyData] = await Promise.all([
        getMyVerifications(),
        getMyProperties(),
      ]);
      setVerifications(verificationData.map(toUiVerification));
      setProperties(propertyData.map(toUiProperty));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to load verification data.'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const submitProfile = async () => {
    setSubmitting('profile');
    setFormError('');
    setSuccess('');
    try {
      await createVerification({ type, documentUrl: documentUrl.trim(), notes: notes.trim() || undefined });
      setDocumentUrl('');
      setNotes('');
      setSuccess('Landlord verification submitted.');
      await loadData(true);
    } catch (err) {
      setFormError(getApiErrorMessage(err, 'Unable to submit verification.'));
    } finally {
      setSubmitting('');
    }
  };

  const submitProperty = async (propertyId: string) => {
    setSubmitting(propertyId);
    setFormError('');
    setSuccess('');
    try {
      await requestPropertyVerification(propertyId, {
        documentUrl: propertyDocumentUrl.trim(),
        notes: 'Property ownership document submitted from mobile.',
      });
      setPropertyDocumentUrl('');
      setSuccess('Property verification requested.');
      await loadData(true);
    } catch (err) {
      setFormError(getApiErrorMessage(err, 'Unable to request property verification.'));
    } finally {
      setSubmitting('');
    }
  };

  return (
    <Screen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadData(true)} />}>
      <ScreenHeader title="Verification" subtitle="Submit landlord and property documents." />
      {success ? <Text style={{ color: colors.trust, fontWeight: '800' }}>{success}</Text> : null}
      <SectionHeader title="Landlord verification" />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {types.map(item => (
          <AppButton key={item} title={item} onPress={() => setType(item)} variant={type === item ? 'primary' : 'ghost'} />
        ))}
      </View>
      <AppInput label="Document URL" value={documentUrl} onChangeText={setDocumentUrl} placeholder="https://example.com/document.pdf" />
      <AppInput label="Notes" value={notes} onChangeText={setNotes} placeholder="PAN or bank proof uploaded" />
      <AppButton title={submitting === 'profile' ? 'Submitting...' : 'Submit landlord verification'} onPress={submitProfile} disabled={Boolean(submitting)} />
      <SectionHeader title="Property verification" />
      <AppInput label="Property document URL" value={propertyDocumentUrl} onChangeText={setPropertyDocumentUrl} placeholder="https://example.com/property-document.pdf" />
      {formError ? <Text style={{ color: colors.danger }}>{formError}</Text> : null}
      {loading ? <LoadingSkeleton /> : null}
      {!loading && error ? <EmptyState title="Could not load verification data" message={error} actionLabel="Retry" onAction={() => loadData()} /> : null}
      {!loading && !error && properties.length === 0 ? <EmptyState title="No properties yet" message="Add a property before requesting property verification." /> : null}
      {!loading && !error ? properties.map(property => (
        <React.Fragment key={property.id}>
          <PropertyCard property={property} compact />
          <AppButton title={submitting === property.id ? 'Requesting...' : 'Request property verification'} onPress={() => submitProperty(property.id)} disabled={Boolean(submitting) || !propertyDocumentUrl.trim()} variant="outline" />
        </React.Fragment>
      )) : null}
      <SectionHeader title="History" />
      {!loading && !error && verifications.length === 0 ? <EmptyState title="No verifications yet" message="Submit your first verification request above." /> : null}
      {!loading && !error ? verifications.map(item => <VerificationCard key={item.id} item={item} />) : null}
    </Screen>
  );
}
