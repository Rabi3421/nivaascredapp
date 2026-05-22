import React from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppButton } from '../../components/AppButton';
import { AppCard } from '../../components/AppCard';
import { ApplicationCard } from '../../components/ApplicationCard';
import { PropertyCard } from '../../components/PropertyCard';
import { ScoreCard } from '../../components/ScoreCard';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SectionHeader } from '../../components/SectionHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { applications, properties, tenantProfile } from '../../data/mockData';
import { colors } from '../../theme/colors';
import Screen from '../shared/Screen';

export default function TenantHomeScreen() {
  const navigation = useNavigation<any>();
  return (
    <Screen>
      <ScreenHeader title={`Hi, ${tenantProfile.name.split(' ')[0]}`} subtitle="Track your rental trust journey." />
      <ScoreCard score={tenantProfile.score} grade={tenantProfile.grade} onPress={() => navigation.navigate('TenantScore')} />
      <AppCard>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ color: colors.text, fontWeight: '900', fontSize: 17 }}>Verification</Text>
            <Text style={{ color: colors.muted, marginTop: 4 }}>
              {tenantProfile.verifiedItems}/{tenantProfile.totalVerificationItems} checks complete
            </Text>
          </View>
          <StatusBadge label="in progress" tone="warning" />
        </View>
        <AppButton title="Complete verification" variant="outline" onPress={() => navigation.navigate('TenantVerification')} style={{ marginTop: 12 }} />
      </AppCard>
      <SectionHeader title="Quick actions" />
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <AppButton title="Find home" onPress={() => navigation.navigate('PropertyList')} style={{ flex: 1 }} />
        <AppButton title="Reviews" onPress={() => navigation.navigate('TenantReviews')} variant="outline" style={{ flex: 1 }} />
      </View>
      <SectionHeader title="Recent applications" />
      {applications.slice(0, 1).map(item => <ApplicationCard key={item.id} application={item} />)}
      <SectionHeader title="Recommended properties" />
      {properties.slice(0, 2).map(item => (
        <PropertyCard key={item.id} property={item} onPress={() => navigation.navigate('PropertyDetails', { propertyId: item.id })} compact />
      ))}
    </Screen>
  );
}
