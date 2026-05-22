import React, { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppButton } from '../../components/AppButton';
import { AppCard } from '../../components/AppCard';
import { ApplicationCard } from '../../components/ApplicationCard';
import { EmptyState } from '../../components/EmptyState';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { ScoreCard } from '../../components/ScoreCard';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SectionHeader } from '../../components/SectionHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { landlordProfile } from '../../data/mockData';
import { getLandlordApplications } from '../../services/applications/applicationApi';
import { getMyProperties } from '../../services/properties/propertyApi';
import { colors } from '../../theme/colors';
import type { Application } from '../../types';
import { toUiApplication } from '../../types/application';
import Screen from '../shared/Screen';

export default function LandlordHomeScreen() {
  const navigation = useNavigation<any>();
  const [propertyCount, setPropertyCount] = useState(0);
  const [pendingRequests, setPendingRequests] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHome = useCallback(async () => {
    setLoading(true);
    try {
      const [propertyData, applicationData] = await Promise.all([
        getMyProperties(),
        getLandlordApplications(),
      ]);
      const applications = applicationData.map(toUiApplication);
      setPropertyCount(propertyData.length);
      setPendingRequests(applications.filter(item => item.status === 'pending').slice(0, 3));
    } catch {
      setPropertyCount(0);
      setPendingRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHome();
  }, [loadHome]);

  return (
    <Screen>
      <ScreenHeader title={`Hi, ${landlordProfile.name.split(' ')[0]}`} subtitle="Manage properties, applications, and trust." />
      <ScoreCard score={landlordProfile.score} grade={landlordProfile.grade} onPress={() => navigation.navigate('LandlordScore')} />
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <AppCard style={{ flex: 1 }}>
          <Text style={{ color: colors.text, fontSize: 24, fontWeight: '900' }}>{propertyCount}</Text>
          <Text style={{ color: colors.muted }}>Properties</Text>
        </AppCard>
        <AppCard style={{ flex: 1 }}>
          <Text style={{ color: colors.text, fontSize: 24, fontWeight: '900' }}>{pendingRequests.length}</Text>
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
      {loading ? <LoadingSkeleton /> : null}
      {!loading && pendingRequests.length === 0 ? <EmptyState title="No pending requests" message="New tenant applications will appear here." /> : null}
      {!loading ? pendingRequests.map(item => <ApplicationCard key={item.id} application={item} />) : null}
    </Screen>
  );
}
