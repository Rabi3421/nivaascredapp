import React, { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { AppButton } from '../../components/AppButton';
import { AppCard } from '../../components/AppCard';
import { EmptyState } from '../../components/EmptyState';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { ScoreCard } from '../../components/ScoreCard';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SectionHeader } from '../../components/SectionHeader';
import { getMyScore, recalculateMyScore } from '../../services/score/scoreApi';
import { colors } from '../../theme/colors';
import type { ScoreBreakdown } from '../../types';
import type { ApiScore } from '../../types/score';
import { toUiScoreBreakdown } from '../../types/score';
import { getApiErrorMessage } from '../../utils/apiError';
import { formatShortDate } from '../../utils/format';
import Screen from '../shared/Screen';

export default function LandlordScoreScreen() {
  const [score, setScore] = useState<ApiScore | null>(null);
  const [breakdown, setBreakdown] = useState<ScoreBreakdown[]>([]);
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);
  const [error, setError] = useState('');

  const loadScore = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getMyScore();
      setScore(data);
      setBreakdown(toUiScoreBreakdown(data));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to load score.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadScore();
  }, [loadScore]);

  const recalculate = async () => {
    setRecalculating(true);
    setError('');
    try {
      const data = await recalculateMyScore();
      setScore(data);
      setBreakdown(toUiScoreBreakdown(data));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to recalculate score.'));
    } finally {
      setRecalculating(false);
    }
  };

  return (
    <Screen>
      <ScreenHeader title="NivaasCred Score" subtitle="Your landlord trust profile." />
      {loading ? <LoadingSkeleton /> : null}
      {!loading && error ? <EmptyState title="Could not load score" message={error} actionLabel="Retry" onAction={loadScore} /> : null}
      {!loading && !error && score ? (
        <>
          <ScoreCard score={score.score} grade={score.grade} />
          {score.lastCalculatedAt ? <Text style={{ color: colors.muted }}>Last calculated {formatShortDate(score.lastCalculatedAt)}</Text> : null}
          <AppButton title={recalculating ? 'Recalculating...' : 'Recalculate'} onPress={recalculate} disabled={recalculating} variant="outline" />
          <SectionHeader title="Breakdown" />
          {breakdown.map(item => (
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
        </>
      ) : null}
    </Screen>
  );
}
