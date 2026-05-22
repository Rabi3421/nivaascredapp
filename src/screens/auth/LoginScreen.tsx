import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { AppButton } from '../../components/AppButton';
import { AppInput } from '../../components/AppInput';
import { ScreenHeader } from '../../components/ScreenHeader';
import { useAuth } from '../../context/AuthContext';
import type { AuthScreenProps } from '../../navigation/types';
import { colors } from '../../theme/colors';
import Screen from '../shared/Screen';

export default function LoginScreen({ navigation }: AuthScreenProps<'Login'>) {
  const { login, devPreviewRole } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen>
      <ScreenHeader title="Welcome back" subtitle="Sign in with your NivaasCred account." />
      <AppInput label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" autoCapitalize="none" keyboardType="email-address" />
      <AppInput label="Password" value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <AppButton title={isSubmitting ? 'Signing in...' : 'Log in'} onPress={handleLogin} disabled={isSubmitting} />
      <AppButton title="Forgot password" onPress={() => navigation.navigate('ForgotPassword')} variant="ghost" />
      {__DEV__ ? (
        <>
          <Text style={styles.todo}>Developer preview bypass</Text>
          <AppButton title="Preview as Tenant" onPress={() => devPreviewRole('tenant')} variant="outline" />
          <AppButton title="Preview as Landlord" onPress={() => devPreviewRole('landlord')} variant="outline" />
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  todo: { color: '#64748B', lineHeight: 20 },
  error: { color: colors.danger, fontWeight: '700' },
});
