import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { AppCard } from './AppCard';
import { AppButton } from './AppButton';

export function ScoreCard({
  score,
  grade,
  onPress,
}: {
  score: number;
  grade: string;
  onPress?: () => void;
}) {
  const percent = Math.max(0, Math.min(100, ((score - 300) / 600) * 100));
  return (
    <AppCard style={styles.card}>
      <View style={styles.row}>
        <View>
          <Text style={styles.kicker}>NivaasCred Score</Text>
          <Text style={styles.score}>{score}</Text>
          <Text style={styles.grade}>{grade} rating</Text>
        </View>
        <View style={styles.ring}>
          <Text style={styles.ringText}>{Math.round(percent)}%</Text>
        </View>
      </View>
      <View style={styles.bar}>
        <View style={[styles.fill, { width: `${percent}%` }]} />
      </View>
      <Text style={styles.note}>
        Based on reviews, rental history, applications, property trust, and verification.
      </Text>
      {onPress ? <AppButton title="View score details" onPress={onPress} variant="outline" /> : null}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: { gap: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  kicker: { color: colors.muted, fontSize: 13, fontWeight: '700' },
  score: { color: colors.text, fontSize: 40, fontWeight: '900', marginTop: 2 },
  grade: { color: colors.trust, fontSize: 14, fontWeight: '800' },
  ring: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#DBEAFE',
    borderWidth: 8,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringText: { color: colors.primaryDark, fontWeight: '900', fontSize: 14 },
  bar: { height: 8, borderRadius: 999, backgroundColor: colors.surfaceMuted, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.primary, borderRadius: 999 },
  note: { color: colors.muted, fontSize: 13, lineHeight: 19 },
});
