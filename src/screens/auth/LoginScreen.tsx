import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { AppButton } from '../../components/AppButton';
import { AppInput } from '../../components/AppInput';
import { ScreenHeader } from '../../components/ScreenHeader';
import type { AuthActions, AuthScreenProps } from '../../navigation/types';
import Screen from '../shared/Screen';

export default function LoginScreen({
  navigation,
  onLoginAsRole,
}: AuthScreenProps<'Login'> & AuthActions) {
  return (
    <Screen>
      <ScreenHeader title="Welcome back" subtitle="Use the role buttons for now. Real auth will connect to the Next.js backend later." />
      <AppInput label="Email" placeholder="you@example.com" autoCapitalize="none" />
      <AppInput label="Password" placeholder="Password" secureTextEntry />
      <AppButton title="Login as Tenant" onPress={() => onLoginAsRole('tenant')} />
      <AppButton title="Login as Landlord" onPress={() => onLoginAsRole('landlord')} variant="outline" />
      <AppButton title="Forgot password" onPress={() => navigation.navigate('ForgotPassword')} variant="ghost" />
      <Text style={styles.todo}>TODO: Replace role shortcuts with API login and secure mobile auth storage.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  todo: { color: '#64748B', lineHeight: 20 },
});
