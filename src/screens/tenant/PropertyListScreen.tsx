import React, { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppButton } from '../../components/AppButton';
import { AppInput } from '../../components/AppInput';
import { EmptyState } from '../../components/EmptyState';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { PropertyCard } from '../../components/PropertyCard';
import { ScreenHeader } from '../../components/ScreenHeader';
import { properties } from '../../data/mockData';
import { colors } from '../../theme/colors';
import Screen from '../shared/Screen';

export default function PropertyListScreen() {
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('All');
  const [loading, setLoading] = useState(false);
  const filtered = useMemo(
    () =>
      properties.filter(item =>
        `${item.title} ${item.city} ${item.propertyType}`.toLowerCase().includes(search.toLowerCase()) &&
        (city === 'All' || item.city === city),
      ),
    [search, city],
  );

  return (
    <Screen>
      <ScreenHeader title="Properties" subtitle="Browse verified rentals across Indian cities." />
      <AppInput label="Search" value={search} onChangeText={setSearch} placeholder="Search city, locality, property" />
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {['All', 'Bengaluru', 'Pune'].map(item => (
          <AppButton key={item} title={item} onPress={() => setCity(item)} variant={city === item ? 'primary' : 'outline'} style={{ flex: 1 }} />
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <AppButton title="Rent: Any" variant="ghost" style={{ flex: 1 }} />
        <AppButton title="Type: Any" variant="ghost" style={{ flex: 1 }} />
      </View>
      <Text style={{ color: colors.muted }}>Filters are UI-only for now. TODO: connect to `/api/properties`.</Text>
      {loading ? <LoadingSkeleton /> : null}
      {!loading && filtered.length === 0 ? (
        <EmptyState title="No properties found" message="Try a different city or search term." actionLabel="Reset" onAction={() => { setSearch(''); setCity('All'); setLoading(false); }} />
      ) : null}
      {filtered.map(item => (
        <PropertyCard key={item.id} property={item} onPress={() => navigation.navigate('PropertyDetails', { propertyId: item.id })} />
      ))}
    </Screen>
  );
}
