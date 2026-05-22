import React, { useCallback, useEffect, useState } from 'react';
import { Image, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../../components/AppButton';
import { AppCard } from '../../components/AppCard';
import { AppInput } from '../../components/AppInput';
import { EmptyState } from '../../components/EmptyState';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { ScreenHeader } from '../../components/ScreenHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { applyForProperty } from '../../services/applications/applicationApi';
import { getPropertyById } from '../../services/properties/propertyApi';
import { colors } from '../../theme/colors';
import type { Property } from '../../types';
import { toUiProperty } from '../../types/property';
import { getApiErrorMessage } from '../../utils/apiError';
import { formatCurrency } from '../../utils/format';
import Screen from '../shared/Screen';
import { ModalSheet } from '../shared/ModalSheet';

export default function PropertyDetailsScreen({ route, navigation }: any) {
  const propertyId = route.params?.propertyId;
  const [applyOpen, setApplyOpen] = useState(false);
  const [property, setProperty] = useState<Property | null>(null);
  const [message, setMessage] = useState('I am interested in this property and would like to schedule a visit.');
  const [moveInDate, setMoveInDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [applyError, setApplyError] = useState('');
  const [success, setSuccess] = useState('');

  const loadProperty = useCallback(async (isRefresh = false) => {
    if (!propertyId) return;
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError('');
    try {
      const apiProperty = await getPropertyById(propertyId);
      setProperty(toUiProperty(apiProperty));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to load property details.'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [propertyId]);

  useEffect(() => {
    loadProperty();
  }, [loadProperty]);

  const submitApplication = async () => {
    if (!property) return;
    setSubmitting(true);
    setApplyError('');
    setSuccess('');
    try {
      await applyForProperty({
        propertyId: property.id,
        message: message.trim() || undefined,
        moveInDate: moveInDate.trim() || undefined,
      });
      setSuccess('Application submitted successfully.');
      setApplyOpen(false);
    } catch (err) {
      setApplyError(getApiErrorMessage(err, 'Unable to submit application.'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Screen>
        <ScreenHeader title="Property details" subtitle="Loading listing details." />
        <LoadingSkeleton />
      </Screen>
    );
  }

  if (error || !property) {
    return (
      <Screen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadProperty(true)} />}>
        <ScreenHeader title="Property details" subtitle="Verified listing preview with landlord trust summary." />
        <EmptyState title="Could not load property" message={error || 'Property was not found.'} actionLabel="Retry" onAction={() => loadProperty()} />
        <AppButton title="Back" variant="ghost" onPress={() => navigation.goBack()} />
      </Screen>
    );
  }

  return (
    <Screen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadProperty(true)} />}>
      <ScreenHeader title="Property details" subtitle="Verified listing preview with landlord trust summary." />
      <Image source={{ uri: property.imageUrl }} style={styles.image} />
      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        <StatusBadge label={property.status} tone="success" />
        {property.verificationStatus === 'approved' ? <StatusBadge label="verified property" tone="info" /> : null}
      </View>
      <Text style={styles.title}>{property.title}</Text>
      <Text style={styles.address}>{property.address}</Text>
      <Text style={styles.price}>{formatCurrency(property.rentAmount)}/month</Text>
      <Text style={styles.body}>Deposit: {formatCurrency(property.depositAmount)}</Text>
      {success ? <Text style={styles.success}>{success}</Text> : null}
      {property.description ? (
        <AppCard>
          <Text style={styles.section}>Description</Text>
          <Text style={styles.body}>{property.description}</Text>
        </AppCard>
      ) : null}
      <AppCard>
        <Text style={styles.section}>Amenities</Text>
        <Text style={styles.body}>{property.amenities.length ? property.amenities.join('  |  ') : 'No amenities listed yet.'}</Text>
      </AppCard>
      <AppCard>
        <Text style={styles.section}>Property details</Text>
        <Text style={styles.body}>{property.propertyType} - {property.furnishingStatus}</Text>
        <Text style={styles.body}>{property.bedrooms} bedrooms - {property.bathrooms} bathrooms</Text>
      </AppCard>
      <AppCard>
        <Text style={styles.section}>Landlord</Text>
        <Text style={styles.body}>{property.landlordName} - NivaasCred Score {property.landlordScore}</Text>
      </AppCard>
      <AppButton title={success ? 'Application submitted' : 'Apply for this property'} onPress={() => setApplyOpen(true)} disabled={Boolean(success)} />
      <AppButton title="Back" variant="ghost" onPress={() => navigation.goBack()} />
      <ModalSheet visible={applyOpen} title="Apply for property" onClose={() => setApplyOpen(false)}>
        <AppInput label="Message" value={message} onChangeText={setMessage} placeholder="Introduce yourself" multiline style={{ minHeight: 90, textAlignVertical: 'top' }} />
        <AppInput label="Move-in date" value={moveInDate} onChangeText={setMoveInDate} placeholder="YYYY-MM-DD" />
        {applyError ? <Text style={styles.error}>{applyError}</Text> : null}
        <AppButton title={submitting ? 'Submitting...' : 'Submit application'} onPress={submitApplication} disabled={submitting} />
      </ModalSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  image: { height: 220, borderRadius: 22, backgroundColor: colors.surfaceMuted },
  title: { color: colors.text, fontSize: 25, fontWeight: '900' },
  address: { color: colors.muted, lineHeight: 20 },
  price: { color: colors.primary, fontSize: 24, fontWeight: '900' },
  section: { color: colors.text, fontWeight: '900', fontSize: 16, marginBottom: 6 },
  body: { color: colors.muted, lineHeight: 21 },
  error: { color: colors.danger, lineHeight: 20 },
  success: { color: colors.trust, fontWeight: '800' },
});
