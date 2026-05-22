import React, { useCallback, useState } from 'react';
import { Alert, RefreshControl, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AppButton } from '../../components/AppButton';
import { EmptyState } from '../../components/EmptyState';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { PropertyCard } from '../../components/PropertyCard';
import { ScreenHeader } from '../../components/ScreenHeader';
import { deleteProperty, getMyProperties } from '../../services/properties/propertyApi';
import { colors } from '../../theme/colors';
import type { Property } from '../../types';
import { toUiProperty } from '../../types/property';
import { getApiErrorMessage } from '../../utils/apiError';
import Screen from '../shared/Screen';

export default function LandlordPropertiesScreen() {
  const navigation = useNavigation<any>();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [error, setError] = useState('');

  const loadProperties = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError('');
    try {
      const data = await getMyProperties();
      setProperties(data.map(toUiProperty));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to load your properties.'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProperties();
    }, [loadProperties]),
  );

  const confirmDelete = (property: Property) => {
    Alert.alert('Delete property?', `This will remove "${property.title}" from your listings.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setDeletingId(property.id);
          setError('');
          try {
            await deleteProperty(property.id);
            setProperties(current => current.filter(item => item.id !== property.id));
          } catch (err) {
            setError(getApiErrorMessage(err, 'Unable to delete property.'));
          } finally {
            setDeletingId('');
          }
        },
      },
    ]);
  };

  return (
    <Screen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadProperties(true)} />}>
      <ScreenHeader title="My properties" subtitle="Create, edit, and verify your listings." />
      <AppButton title="Add property" onPress={() => navigation.navigate('AddEditProperty')} />
      {loading ? <LoadingSkeleton /> : null}
      {!loading && error ? (
        <EmptyState title="Could not load properties" message={error} actionLabel="Retry" onAction={() => loadProperties()} />
      ) : null}
      {!loading && !error && properties.length === 0 ? (
        <EmptyState title="No properties yet" message="Create your first listing to start receiving tenant applications." actionLabel="Add property" onAction={() => navigation.navigate('AddEditProperty')} />
      ) : null}
      {!loading && !error ? (
        properties.map(item => (
          <View key={item.id} style={{ gap: 8 }}>
            <PropertyCard property={item} compact />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <AppButton title="Edit" onPress={() => navigation.navigate('AddEditProperty', { propertyId: item.id })} variant="outline" style={{ flex: 1 }} />
              <AppButton title={deletingId === item.id ? 'Deleting...' : 'Delete'} onPress={() => confirmDelete(item)} disabled={Boolean(deletingId)} variant="danger" style={{ flex: 1 }} />
            </View>
            <Text style={{ color: colors.muted }}>Verification: {item.verificationStatus}</Text>
          </View>
        ))
      ) : null}
    </Screen>
  );
}
