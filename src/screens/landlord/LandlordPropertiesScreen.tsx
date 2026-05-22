import React from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppButton } from '../../components/AppButton';
import { PropertyCard } from '../../components/PropertyCard';
import { ScreenHeader } from '../../components/ScreenHeader';
import { properties } from '../../data/mockData';
import { colors } from '../../theme/colors';
import Screen from '../shared/Screen';

export default function LandlordPropertiesScreen() {
  const navigation = useNavigation<any>();
  return (
    <Screen>
      <ScreenHeader title="My properties" subtitle="Create, edit, and verify your listings." />
      <AppButton title="Add property" onPress={() => navigation.navigate('AddEditProperty')} />
      {properties.map(item => (
        <View key={item.id} style={{ gap: 8 }}>
          <PropertyCard property={item} compact />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <AppButton title="Edit" onPress={() => navigation.navigate('AddEditProperty', { propertyId: item.id })} variant="outline" style={{ flex: 1 }} />
            <AppButton title="Delete UI" variant="ghost" style={{ flex: 1 }} />
          </View>
          <Text style={{ color: colors.muted }}>Verification: {item.verificationStatus}</Text>
        </View>
      ))}
    </Screen>
  );
}
