import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppButton } from '../../components/AppButton';
import { AppInput } from '../../components/AppInput';
import { EmptyState } from '../../components/EmptyState';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { PropertyCard } from '../../components/PropertyCard';
import { ScreenHeader } from '../../components/ScreenHeader';
import { getPublicProperties } from '../../services/properties/propertyApi';
import { colors } from '../../theme/colors';
import type { Property } from '../../types';
import { toUiProperty } from '../../types/property';
import { getApiErrorMessage } from '../../utils/apiError';
import Screen from '../shared/Screen';

export default function PropertyListScreen() {
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('All');
  const [propertyType, setPropertyType] = useState('All');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadProperties = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError('');
    try {
      const data = await getPublicProperties({
        search: search.trim() || undefined,
        city: city === 'All' ? undefined : city,
        propertyType: propertyType === 'All' ? undefined : propertyType,
        limit: 30,
      });
      setProperties(data.properties.map(toUiProperty));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to load properties.'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [city, propertyType, search]);

  useEffect(() => {
    const timer = setTimeout(() => loadProperties(), 350);
    return () => clearTimeout(timer);
  }, [loadProperties]);

  const resetFilters = () => {
    setSearch('');
    setCity('All');
    setPropertyType('All');
  };

  return (
    <Screen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadProperties(true)} />}>
      <ScreenHeader title="Properties" subtitle="Browse verified rentals across Indian cities." />
      <AppInput label="Search" value={search} onChangeText={setSearch} placeholder="Search city, locality, property" />
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {['All', 'Bengaluru', 'Pune'].map(item => (
          <AppButton key={item} title={item} onPress={() => setCity(item)} variant={city === item ? 'primary' : 'outline'} style={{ flex: 1 }} />
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {['All', '1BHK', '2BHK', '3BHK'].map(item => (
          <AppButton key={item} title={item === 'All' ? 'Type: Any' : item} onPress={() => setPropertyType(item)} variant={propertyType === item ? 'secondary' : 'ghost'} style={{ flex: 1 }} />
        ))}
      </View>
      <Text style={{ color: colors.muted }}>Pull down to refresh live listings.</Text>
      {loading ? <LoadingSkeleton /> : null}
      {!loading && error ? (
        <EmptyState title="Could not load properties" message={error} actionLabel="Retry" onAction={() => loadProperties()} />
      ) : null}
      {!loading && !error && properties.length === 0 ? (
        <EmptyState title="No properties found" message="Try a different city, search term, or property type." actionLabel="Reset" onAction={resetFilters} />
      ) : null}
      {!loading && !error && properties.map(item => (
        <PropertyCard key={item.id} property={item} onPress={() => navigation.navigate('PropertyDetails', { propertyId: item.id })} />
      ))}
    </Screen>
  );
}
