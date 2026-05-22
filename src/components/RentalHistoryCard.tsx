import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { RentalHistory } from '../types';
import { formatCurrency, formatShortDate } from '../utils/format';
import { colors } from '../theme/colors';
import { AppCard } from './AppCard';
import { AppButton } from './AppButton';
import { StatusBadge, toneForStatus } from './StatusBadge';

export function RentalHistoryCard({
  rental,
  counterpartyLabel,
}: {
  rental: RentalHistory;
  counterpartyLabel: 'Landlord' | 'Tenant';
}) {
  return (
    <AppCard style={styles.card}>
      <View style={styles.row}>
        <View style={styles.flex}>
          <Text style={styles.title}>{rental.property.title}</Text>
          <Text style={styles.meta}>{counterpartyLabel}: {rental.counterpartyName} - Score {rental.counterpartyScore}</Text>
        </View>
        <StatusBadge label={rental.status} tone={toneForStatus(rental.status)} />
      </View>
      <View style={styles.grid}>
        <Text style={styles.value}>{formatCurrency(rental.monthlyRent)}/mo</Text>
        <Text style={styles.value}>Deposit {formatCurrency(rental.depositAmount)}</Text>
        <Text style={styles.meta}>{formatShortDate(rental.startDate)} - {rental.endDate ? formatShortDate(rental.endDate) : 'Open'}</Text>
      </View>
      <View style={styles.actions}>
        <AppButton title={`Review ${counterpartyLabel.toLowerCase()}`} variant="outline" style={styles.action} />
        <AppButton title="Request review" variant="ghost" style={styles.action} />
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: { gap: 12 },
  row: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  flex: { flex: 1 },
  title: { color: colors.text, fontSize: 16, fontWeight: '800' },
  meta: { color: colors.muted, fontSize: 13, marginTop: 4 },
  grid: { gap: 5 },
  value: { color: colors.text, fontWeight: '700' },
  actions: { flexDirection: 'row', gap: 8 },
  action: { flex: 1, minHeight: 40 },
});
