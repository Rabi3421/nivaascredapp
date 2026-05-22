import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { AppButton } from './AppButton';

export function EmptyState({
  title,
  message,
  actionLabel,
  onAction,
}: {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.icon}>-</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel ? (
        <AppButton title={actionLabel} onPress={onAction} variant="outline" style={styles.button} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: 36, paddingHorizontal: 20 },
  icon: { color: colors.muted, fontSize: 34 },
  title: { color: colors.text, fontSize: 18, fontWeight: '800', marginTop: 6 },
  message: { color: colors.muted, textAlign: 'center', marginTop: 6, lineHeight: 20 },
  button: { marginTop: 16 },
});
