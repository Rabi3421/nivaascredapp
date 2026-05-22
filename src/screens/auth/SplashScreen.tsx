import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { AuthScreenProps } from '../../navigation/types';
import { colors } from '../../theme/colors';

export default function SplashScreen({ navigation }: AuthScreenProps<'Splash'>) {
  useEffect(() => {
    const timer = setTimeout(() => navigation.replace('Welcome'), 700);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.root}>
      <View style={styles.logo}>
        <Text style={styles.logoText}>NC</Text>
      </View>
      <Text style={styles.title}>NivaasCred</Text>
      <Text style={styles.subtitle}>Rental trust, built clearly.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  logo: { width: 84, height: 84, borderRadius: 24, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  logoText: { color: colors.surface, fontSize: 30, fontWeight: '900' },
  title: { color: colors.text, marginTop: 18, fontSize: 30, fontWeight: '900' },
  subtitle: { color: colors.muted, marginTop: 6 },
});
