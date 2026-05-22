import React from 'react';
import { Text, View } from 'react-native';
import { AppCard } from '../../components/AppCard';
import { ScoreCard } from '../../components/ScoreCard';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SectionHeader } from '../../components/SectionHeader';
import { tenantProfile, tenantScoreBreakdown } from '../../data/mockData';
import { colors } from '../../theme/colors';
import Screen from '../shared/Screen';

export default function TenantScoreScreen() {
  return (
    <Screen>
      <ScreenHeader title="NivaasCred Score" subtitle="A simple view of your rental trust score." />
      <ScoreCard score={tenantProfile.score} grade={tenantProfile.grade} />
      <SectionHeader title="Breakdown" />
      {tenantScoreBreakdown.map(item => (
        <AppCard key={item.label}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: colors.text, fontWeight: '900' }}>{item.label}</Text>
            <Text style={{ color: colors.primary, fontWeight: '900' }}>{item.points}/{item.maxPoints}</Text>
          </View>
        </AppCard>
      ))}
      <SectionHeader title="Improvement tips" />
      {['Complete verification', 'Request reviews', 'Maintain successful rental history'].map(tip => (
        <Text key={tip} style={{ color: colors.muted }}>- {tip}</Text>
      ))}
    </Screen>
  );
}
