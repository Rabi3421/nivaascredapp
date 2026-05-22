import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { Application } from '../types';
import { formatShortDate } from '../utils/format';
import { colors } from '../theme/colors';
import { AppCard } from './AppCard';
import { AppButton } from './AppButton';
import { StatusBadge, toneForStatus } from './StatusBadge';

export function ApplicationCard({
  application,
  landlordActions,
}: {
  application: Application;
  landlordActions?: boolean;
}) {
  return (
    <AppCard style={styles.card}>
      <View style={styles.top}>
        <View style={styles.flex}>
          <Text style={styles.title}>{application.property.title}</Text>
          <Text style={styles.meta}>
            {landlordActions ? application.tenantName : application.property.city} - Applied {formatShortDate(application.appliedAt)}
          </Text>
        </View>
        <StatusBadge label={application.status} tone={toneForStatus(application.status)} />
      </View>
      <View style={styles.timeline}>
        {['pending', 'shortlisted', 'approved'].map((step, index) => (
          <View key={step} style={styles.step}>
            <View style={[styles.dot, index <= 1 || application.status === 'approved' ? styles.dotActive : null]} />
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.message} numberOfLines={2}>{application.message}</Text>
      {landlordActions ? (
        <View style={styles.actions}>
          <AppButton title="Shortlist" variant="outline" style={styles.actionButton} />
          <AppButton title="Approve" variant="secondary" style={styles.actionButton} />
          <AppButton title="Reject" variant="ghost" style={styles.actionButton} />
        </View>
      ) : null}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: { gap: 12 },
  top: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  flex: { flex: 1 },
  title: { color: colors.text, fontSize: 16, fontWeight: '800' },
  meta: { color: colors.muted, marginTop: 4, fontSize: 13 },
  timeline: { flexDirection: 'row', gap: 10 },
  step: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  dotActive: { backgroundColor: colors.primary },
  stepText: { color: colors.muted, fontSize: 12, textTransform: 'capitalize' },
  message: { color: colors.muted, lineHeight: 20 },
  actions: { flexDirection: 'row', gap: 8 },
  actionButton: { flex: 1, minHeight: 40 },
});
