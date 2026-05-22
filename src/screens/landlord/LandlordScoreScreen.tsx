import React from 'react';
import { Text, View } from 'react-native';
import { AppCard } from '../../components/AppCard';
import { ScoreCard } from '../../components/ScoreCard';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SectionHeader } from '../../components/SectionHeader';
import { landlordProfile, landlordScoreBreakdown } from '../../data/mockData';
import { colors } from '../../theme/colors';
import Screen from '../shared/Screen';

export default function LandlordScoreScreen() {
  return (
    <Screen>
      <ScreenHeader title="NivaasCred Score" subtitle="Your landlord trust profile." />
      <ScoreCard score={landlordProfile.score} grade={landlordProfile.grade} />
      <SectionHeader title="Breakdown" />
      {landlordScoreBreakdown.map(item => (
        <AppCard key={item.label}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: colors.text, fontWeight: '900' }}>{item.label}</Text>
            <Text style={{ color: colors.primary, fontWeight: '900' }}>{item.points}/{item.maxPoints}</Text>
          </View>
        </AppCard>
      ))}
      <SectionHeader title="Improvement tips" />
      {['Complete verification', 'Request tenant reviews', 'Keep property information accurate'].map(tip => (
        <Text key={tip} style={{ color: colors.muted }}>- {tip}</Text>
      ))}
    </Screen>
  );
}
