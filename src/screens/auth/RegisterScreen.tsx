import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { AppButton } from '../../components/AppButton';
import { AppInput } from '../../components/AppInput';
import { ScreenHeader } from '../../components/ScreenHeader';
import { useAuth } from '../../context/AuthContext';
import type { AuthScreenProps } from '../../navigation/types';
import type { UserRole } from '../../types';
import { colors } from '../../theme/colors';
import Screen from '../shared/Screen';

export default function RegisterScreen(_props: AuthScreenProps<'Register'>) {
  const { register } = useAuth();
  const [role, setRole] = useState<UserRole>('tenant');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await register({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        password,
        role,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen>
      <ScreenHeader title="Create account" subtitle="Mock signup UI for tenants and landlords." />
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <AppButton title="Tenant" onPress={() => setRole('tenant')} variant={role === 'tenant' ? 'primary' : 'outline'} style={{ flex: 1 }} />
        <AppButton title="Landlord" onPress={() => setRole('landlord')} variant={role === 'landlord' ? 'primary' : 'outline'} style={{ flex: 1 }} />
      </View>
      <AppInput label="Full name" value={fullName} onChangeText={setFullName} placeholder="Your name" />
      <AppInput label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" autoCapitalize="none" keyboardType="email-address" />
      <AppInput label="Phone" value={phone} onChangeText={setPhone} placeholder="9876543210" keyboardType="phone-pad" />
      <AppInput label="Password" value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />
      {error ? <Text style={{ color: colors.danger, fontWeight: '700' }}>{error}</Text> : null}
      <AppButton title={isSubmitting ? 'Creating...' : `Create ${role} account`} onPress={handleRegister} disabled={isSubmitting} />
    </Screen>
  );
}
