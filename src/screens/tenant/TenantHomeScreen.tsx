import React, { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppButton } from '../../components/AppButton';
import { AppCard } from '../../components/AppCard';
import { ApplicationCard } from '../../components/ApplicationCard';
import { EmptyState } from '../../components/EmptyState';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { PropertyCard } from '../../components/PropertyCard';
import { ScoreCard } from '../../components/ScoreCard';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SectionHeader } from '../../components/SectionHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { tenantProfile } from '../../data/mockData';
import { getMyTenantApplications } from '../../services/applications/applicationApi';
import { getPublicProperties } from '../../services/properties/propertyApi';
import { getMyScore } from '../../services/score/scoreApi';
import { colors } from '../../theme/colors';
import type { Application, Property } from '../../types';
import type { ApiScore } from '../../types/score';
import { toUiApplication } from '../../types/application';
import { toUiProperty } from '../../types/property';
import Screen from '../shared/Screen';

export default function TenantHomeScreen() {
  const navigation = useNavigation<any>();
  const [properties, setProperties] = useState<Property[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [score, setScore] = useState<ApiScore | null>(null);
  const [loading, setLoading] = useState(true);

  const loadHome = useCallback(async () => {
    setLoading(true);
    try {
      const [propertyData, applicationData] = await Promise.all([
        getPublicProperties({ limit: 2 }),
        getMyTenantApplications(),
      ]);
      getMyScore().then(setScore).catch(() => setScore(null));
      setProperties(propertyData.properties.map(toUiProperty));
      setApplications(applicationData.map(toUiApplication).slice(0, 2));
    } catch {
      setProperties([]);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHome();
  }, [loadHome]);

  return (
    <Screen>
      <ScreenHeader title={`Hi, ${tenantProfile.name.split(' ')[0]}`} subtitle="Track your rental trust journey." />
      <ScoreCard score={score?.score ?? tenantProfile.score} grade={score?.grade ?? tenantProfile.grade} onPress={() => navigation.navigate('TenantScore')} />
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
      {loading ? <LoadingSkeleton /> : null}
      {!loading && applications.length === 0 ? <EmptyState title="No recent applications" message="Apply for a property and track it here." /> : null}
      {!loading ? applications.map(item => <ApplicationCard key={item.id} application={item} />) : null}
      <SectionHeader title="Recommended properties" />
      {!loading && properties.length === 0 ? <EmptyState title="No recommendations yet" message="Listings will appear here once available." /> : null}
      {!loading && properties.map(item => (
        <PropertyCard key={item.id} property={item} onPress={() => navigation.navigate('PropertyDetails', { propertyId: item.id })} compact />
      ))}
    </Screen>
  );
}
