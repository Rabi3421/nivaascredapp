import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../../components/AppButton';
import { AppCard } from '../../components/AppCard';
import type { AuthScreenProps } from '../../navigation/types';
import { colors } from '../../theme/colors';
import Screen from '../shared/Screen';

export default function WelcomeScreen({ navigation }: AuthScreenProps<'Welcome'>) {
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
        <Text style={styles.cardText}>Sign in or create an account to enter the role-based mobile experience.</Text>
        <AppButton title="Log in" onPress={() => navigation.navigate('Login')} />
        <AppButton title="Create account" onPress={() => navigation.navigate('Register')} variant="outline" />
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
