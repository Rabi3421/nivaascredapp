import React, { useState } from 'react';
import { View } from 'react-native';
import { AppButton } from '../../components/AppButton';
import { AppInput } from '../../components/AppInput';
import { ScreenHeader } from '../../components/ScreenHeader';
import type { AuthActions, AuthScreenProps } from '../../navigation/types';
import type { UserRole } from '../../types';
import Screen from '../shared/Screen';

export default function RegisterScreen({ onLoginAsRole }: AuthScreenProps<'Register'> & AuthActions) {
  const [role, setRole] = useState<UserRole>('tenant');
  return (
    <Screen>
      <ScreenHeader title="Create account" subtitle="Mock signup UI for tenants and landlords." />
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <AppButton title="Tenant" onPress={() => setRole('tenant')} variant={role === 'tenant' ? 'primary' : 'outline'} style={{ flex: 1 }} />
        <AppButton title="Landlord" onPress={() => setRole('landlord')} variant={role === 'landlord' ? 'primary' : 'outline'} style={{ flex: 1 }} />
      </View>
      <AppInput label="Full name" placeholder="Your name" />
      <AppInput label="Email" placeholder="you@example.com" autoCapitalize="none" />
      <AppInput label="Phone" placeholder="+91" keyboardType="phone-pad" />
      <AppInput label="Password" placeholder="Password" secureTextEntry />
      <AppButton title={`Create ${role} account`} onPress={() => onLoginAsRole(role)} />
    </Screen>
  );
}
