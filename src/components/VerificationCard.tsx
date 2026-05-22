import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { VerificationRequest } from '../types';
import { colors } from '../theme/colors';
import { AppCard } from './AppCard';
import { StatusBadge, toneForStatus } from './StatusBadge';

export function VerificationCard({ item }: { item: VerificationRequest }) {
  return (
    <AppCard style={styles.card}>
      <View style={styles.row}>
        <View>
          <Text style={styles.title}>{item.type}</Text>
          <Text style={styles.meta}>{item.propertyTitle ?? 'Profile verification'}</Text>
        </View>
        <StatusBadge label={item.status} tone={toneForStatus(item.status)} />
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: { gap: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  title: { color: colors.text, fontSize: 16, fontWeight: '800', textTransform: 'capitalize' },
  meta: { color: colors.muted, marginTop: 4 },
});
