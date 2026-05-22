import React from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppButton } from '../../components/AppButton';
import { AppCard } from '../../components/AppCard';
import { ApplicationCard } from '../../components/ApplicationCard';
import { ScoreCard } from '../../components/ScoreCard';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SectionHeader } from '../../components/SectionHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { applications, landlordProfile, properties } from '../../data/mockData';
import { colors } from '../../theme/colors';
import Screen from '../shared/Screen';

export default function LandlordHomeScreen() {
  const navigation = useNavigation<any>();
  return (
    <Screen>
      <ScreenHeader title={`Hi, ${landlordProfile.name.split(' ')[0]}`} subtitle="Manage properties, applications, and trust." />
      <ScoreCard score={landlordProfile.score} grade={landlordProfile.grade} onPress={() => navigation.navigate('LandlordScore')} />
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <AppCard style={{ flex: 1 }}>
          <Text style={{ color: colors.text, fontSize: 24, fontWeight: '900' }}>{properties.length}</Text>
          <Text style={{ color: colors.muted }}>Properties</Text>
        </AppCard>
        <AppCard style={{ flex: 1 }}>
          <Text style={{ color: colors.text, fontSize: 24, fontWeight: '900' }}>2</Text>
          <Text style={{ color: colors.muted }}>Pending requests</Text>
        </AppCard>
      </View>
      <AppCard>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ color: colors.text, fontWeight: '900', fontSize: 17 }}>Verification</Text>
            <Text style={{ color: colors.muted, marginTop: 4 }}>
              {landlordProfile.verifiedItems}/{landlordProfile.totalVerificationItems} checks complete
            </Text>
          </View>
          <StatusBadge label="trusted" tone="success" />
        </View>
        <AppButton title="Update verification" variant="outline" onPress={() => navigation.navigate('LandlordVerification')} style={{ marginTop: 12 }} />
      </AppCard>
      <SectionHeader title="Quick actions" />
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <AppButton title="Add property" onPress={() => navigation.navigate('AddEditProperty')} style={{ flex: 1 }} />
        <AppButton title="Reviews" onPress={() => navigation.navigate('LandlordReviews')} variant="outline" style={{ flex: 1 }} />
      </View>
      <SectionHeader title="Pending tenant requests" />
      {applications.map(item => <ApplicationCard key={item.id} application={item} landlordActions />)}
    </Screen>
  );
}
