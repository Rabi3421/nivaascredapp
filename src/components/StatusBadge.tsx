import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

const toneMap = {
  success: { bg: '#DCFCE7', fg: colors.trust },
  warning: { bg: '#FEF3C7', fg: colors.warning },
  danger: { bg: '#FEE2E2', fg: colors.danger },
  info: { bg: '#DBEAFE', fg: colors.primary },
  neutral: { bg: colors.surfaceMuted, fg: colors.muted },
};

export function toneForStatus(status: string): keyof typeof toneMap {
  if (['approved', 'active', 'completed', 'available'].includes(status)) {
    return 'success';
  }
  if (['pending', 'shortlisted', 'under_review'].includes(status)) {
    return 'warning';
  }
  if (['rejected', 'terminated'].includes(status)) {
    return 'danger';
  }
  return 'neutral';
}

export function StatusBadge({
  label,
  tone = 'neutral',
}: {
  label: string;
  tone?: keyof typeof toneMap;
}) {
  const palette = toneMap[tone];
  return (
    <View style={[styles.badge, { backgroundColor: palette.bg }]}>
      <Text style={[styles.text, { color: palette.fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: 'flex-start',
  },
  text: { fontSize: 12, fontWeight: '800', textTransform: 'capitalize' },
});
