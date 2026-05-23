import React from 'react';
import { AppButton } from '../../components/AppButton';
import { AppInput } from '../../components/AppInput';
import { ScreenHeader } from '../../components/ScreenHeader';
import type { AuthScreenProps } from '../../navigation/types';
import Screen from '../shared/Screen';

export default function ForgotPasswordScreen({ navigation }: AuthScreenProps<'ForgotPassword'>) {
  return (
    <Screen>
      <ScreenHeader title="Reset password" subtitle="Password reset is coming soon." />
      <AppInput label="Email" placeholder="you@example.com" autoCapitalize="none" />
      <AppButton title="Send reset link - Coming Soon" disabled />
      <AppButton title="Back to login" onPress={() => navigation.goBack()} variant="ghost" />
    </Screen>
  );
}
