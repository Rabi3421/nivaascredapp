import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../../components/AppButton';
import { AppCard } from '../../components/AppCard';
import type { AuthActions, AuthScreenProps } from '../../navigation/types';
import { colors } from '../../theme/colors';
import Screen from '../shared/Screen';

export default function WelcomeScreen({
  navigation,
  onLoginAsRole,
}: AuthScreenProps<'Welcome'> & AuthActions) {
  return (
    <Screen style={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.brand}>NivaasCred</Text>
        <Text style={styles.title}>Rent with more trust and less guesswork.</Text>
        <Text style={styles.subtitle}>
          Discover verified homes, manage applications, build rental history, and grow your NivaasCred Score.
        </Text>
      </View>
      <AppCard style={styles.card}>
        <Text style={styles.cardTitle}>Preview the mobile MVP</Text>
        <Text style={styles.cardText}>Mock data only. API integration will be added later.</Text>
        <AppButton title="Continue as Tenant" onPress={() => onLoginAsRole('tenant')} />
        <AppButton title="Continue as Landlord" onPress={() => onLoginAsRole('landlord')} variant="outline" />
        <AppButton title="Login screen" onPress={() => navigation.navigate('Login')} variant="ghost" />
        <AppButton title="Create account" onPress={() => navigation.navigate('Register')} variant="ghost" />
      </AppCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { justifyContent: 'center', flexGrow: 1 },
  hero: { gap: 10, marginBottom: 20 },
  brand: { color: colors.primary, fontSize: 16, fontWeight: '900' },
  title: { color: colors.text, fontSize: 34, lineHeight: 40, fontWeight: '900' },
  subtitle: { color: colors.muted, fontSize: 16, lineHeight: 24 },
  card: { gap: 12 },
  cardTitle: { color: colors.text, fontSize: 18, fontWeight: '900' },
  cardText: { color: colors.muted, lineHeight: 20 },
});
