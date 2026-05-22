import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';

export function LoadingSkeleton() {
  return (
    <View style={styles.wrap}>
      <View style={styles.lineLarge} />
      <View style={styles.line} />
      <View style={styles.lineSmall} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    gap: 12,
  },
  lineLarge: { height: 90, borderRadius: 12, backgroundColor: colors.surfaceMuted },
  line: { height: 16, borderRadius: 8, backgroundColor: colors.surfaceMuted },
  lineSmall: { height: 16, width: '45%', borderRadius: 8, backgroundColor: colors.surfaceMuted },
});
