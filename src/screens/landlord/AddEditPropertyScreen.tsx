import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../../components/AppButton';
import { AppInput } from '../../components/AppInput';
import { EmptyState } from '../../components/EmptyState';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { ScreenHeader } from '../../components/ScreenHeader';
import { createProperty, getPropertyById, updateProperty } from '../../services/properties/propertyApi';
import { colors } from '../../theme/colors';
import type { ApiProperty, PropertyPayload } from '../../types/property';
import { getApiErrorMessage } from '../../utils/apiError';
import Screen from '../shared/Screen';

const propertyTypes = ['1BHK', '2BHK', '3BHK', '4BHK', 'Studio', 'Villa', 'PG'] as const;
const furnishingStatuses = ['unfurnished', 'semi_furnished', 'fully_furnished'] as const;

interface FormState {
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  rentAmount: string;
  depositAmount: string;
  propertyType: typeof propertyTypes[number];
  furnishingStatus: typeof furnishingStatuses[number];
  bedrooms: string;
  bathrooms: string;
  amenities: string;
  imageUrl: string;
}

const initialForm: FormState = {
  title: '',
  description: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  rentAmount: '',
  depositAmount: '',
  propertyType: '2BHK',
  furnishingStatus: 'semi_furnished',
  bedrooms: '2',
  bathrooms: '2',
  amenities: '',
  imageUrl: '',
};

function formFromProperty(property: ApiProperty): FormState {
  const primaryImage = property.images?.find(image => image.isPrimary) ?? property.images?.[0];
  return {
    title: property.title,
    description: property.description,
    address: property.address.line1,
    city: property.city,
    state: property.state,
    pincode: property.pincode,
    rentAmount: String(property.rentAmount),
    depositAmount: String(property.depositAmount),
    propertyType: property.propertyType,
    furnishingStatus: property.furnishingStatus,
    bedrooms: String(property.bedrooms),
    bathrooms: String(property.bathrooms),
    amenities: property.amenities?.join(', ') ?? '',
    imageUrl: primaryImage?.url ?? '',
  };
}

export default function AddEditPropertyScreen({ route, navigation }: any) {
  const propertyId = route.params?.propertyId as string | undefined;
  const editing = Boolean(propertyId);
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(Boolean(propertyId));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const updateField = (key: keyof FormState, value: string) => {
    setForm(current => ({ ...current, [key]: value }));
  };

  const loadProperty = useCallback(async () => {
    if (!propertyId) return;
    setLoading(true);
    setError('');
    try {
      const property = await getPropertyById(propertyId);
      setForm(formFromProperty(property));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to load property for editing.'));
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    loadProperty();
  }, [loadProperty]);

  const buildPayload = (): PropertyPayload | null => {
    const rent = Number(form.rentAmount);
    const deposit = Number(form.depositAmount);
    const bedrooms = Number(form.bedrooms);
    const bathrooms = Number(form.bathrooms);

    if (!form.title.trim() || !form.description.trim() || !form.address.trim() || !form.city.trim() || !form.state.trim()) {
      setError('Please complete title, description, address, city, and state.');
      return null;
    }
    if (!/^\d{6}$/.test(form.pincode.trim())) {
      setError('Pincode must be exactly 6 digits.');
      return null;
    }
    if (Number.isNaN(rent) || rent < 1000) {
      setError('Rent must be at least ₹1,000.');
      return null;
    }
    if (Number.isNaN(deposit) || deposit < 0) {
      setError('Deposit cannot be negative.');
      return null;
    }
    if (Number.isNaN(bedrooms) || Number.isNaN(bathrooms)) {
      setError('Bedrooms and bathrooms must be valid numbers.');
      return null;
    }

    const imageUrl = form.imageUrl.trim();
    return {
      title: form.title.trim(),
      description: form.description.trim(),
      address: {
        line1: form.address.trim(),
        locality: form.city.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        pincode: form.pincode.trim(),
      },
      rentAmount: rent,
      depositAmount: deposit,
      propertyType: form.propertyType,
      furnishingStatus: form.furnishingStatus,
      bedrooms,
      bathrooms,
      amenities: form.amenities.split(',').map(item => item.trim()).filter(Boolean),
      images: imageUrl ? [{ url: imageUrl, alt: form.title.trim(), isPrimary: true }] : undefined,
      availabilityStatus: 'available',
    };
  };

  const submit = async () => {
    const payload = buildPayload();
    if (!payload) return;
    setSubmitting(true);
    setError('');
    try {
      if (propertyId) await updateProperty(propertyId, payload);
      else await createProperty(payload);
      navigation.goBack();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to save property.'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Screen>
        <ScreenHeader title={editing ? 'Edit property' : 'Add property'} subtitle="Loading property details." />
        <LoadingSkeleton />
      </Screen>
    );
  }

  if (editing && error && !form.title) {
    return (
      <Screen>
        <ScreenHeader title="Edit property" subtitle="Unable to open this listing." />
        <EmptyState title="Could not load property" message={error} actionLabel="Retry" onAction={loadProperty} />
        <AppButton title="Back" variant="ghost" onPress={() => navigation.goBack()} />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenHeader title={editing ? 'Edit property' : 'Add property'} subtitle="Save listing details for tenant discovery." />
      <AppInput label="Title" value={form.title} onChangeText={value => updateField('title', value)} placeholder="Modern 2BHK apartment" />
      <AppInput label="Description" value={form.description} onChangeText={value => updateField('description', value)} placeholder="Describe the property" multiline style={{ minHeight: 92, textAlignVertical: 'top' }} />
      <AppInput label="Address" value={form.address} onChangeText={value => updateField('address', value)} placeholder="Street and locality" />
      <AppInput label="City" value={form.city} onChangeText={value => updateField('city', value)} placeholder="Bengaluru" />
      <AppInput label="State" value={form.state} onChangeText={value => updateField('state', value)} placeholder="Karnataka" />
      <AppInput label="Pincode" value={form.pincode} onChangeText={value => updateField('pincode', value)} placeholder="560001" keyboardType="number-pad" />
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <AppInput label="Rent" value={form.rentAmount} onChangeText={value => updateField('rentAmount', value)} placeholder="32000" keyboardType="number-pad" style={{ flex: 1 }} />
        <AppInput label="Deposit" value={form.depositAmount} onChangeText={value => updateField('depositAmount', value)} placeholder="90000" keyboardType="number-pad" style={{ flex: 1 }} />
      </View>
      <Text style={styles.label}>Property type</Text>
      <View style={styles.segmentRow}>
        {propertyTypes.map(item => (
          <AppButton key={item} title={item} onPress={() => updateField('propertyType', item)} variant={form.propertyType === item ? 'primary' : 'ghost'} style={styles.segmentButton} />
        ))}
      </View>
      <Text style={styles.label}>Furnishing</Text>
      <View style={styles.segmentRow}>
        {furnishingStatuses.map(item => (
          <AppButton key={item} title={item.replace('_', ' ')} onPress={() => updateField('furnishingStatus', item)} variant={form.furnishingStatus === item ? 'secondary' : 'ghost'} style={styles.segmentButton} />
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <AppInput label="Bedrooms" value={form.bedrooms} onChangeText={value => updateField('bedrooms', value)} placeholder="2" keyboardType="number-pad" style={{ flex: 1 }} />
        <AppInput label="Bathrooms" value={form.bathrooms} onChangeText={value => updateField('bathrooms', value)} placeholder="2" keyboardType="number-pad" style={{ flex: 1 }} />
      </View>
      <AppInput label="Amenities" value={form.amenities} onChangeText={value => updateField('amenities', value)} placeholder="Lift, Security, Balcony" />
      <AppInput label="Image URL" value={form.imageUrl} onChangeText={value => updateField('imageUrl', value)} placeholder="https://example.com/home.jpg" />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <AppButton title={submitting ? 'Saving...' : editing ? 'Save changes' : 'Create property'} onPress={submit} disabled={submitting} />
      <AppButton title="Back" variant="ghost" onPress={() => navigation.goBack()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: { color: colors.text, fontSize: 13, fontWeight: '700' },
  segmentRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  segmentButton: { minHeight: 40 },
  error: { color: colors.danger, lineHeight: 20 },
});
