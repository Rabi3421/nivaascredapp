import React from 'react';
import { Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppButton } from '../../components/AppButton';
import { AppCard } from '../../components/AppCard';
import { ScreenHeader } from '../../components/ScreenHeader';
import { useAuth } from '../../context/AuthContext';
import { tenantProfile } from '../../data/mockData';
import { colors } from '../../theme/colors';
import Screen from '../shared/Screen';

export default function TenantProfileScreen() {
  const navigation = useNavigation<any>();
  const { user, logout } = useAuth();
  const displayName = user?.fullName ?? tenantProfile.name;
  const email = user?.email ?? tenantProfile.email;
  const phone = user?.phone ?? tenantProfile.phone;

  return (
    <Screen>
      <ScreenHeader title="Profile" subtitle="Tenant account and trust shortcuts." />
      <AppCard>
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: '900' }}>{displayName}</Text>
        <Text style={{ color: colors.muted, marginTop: 6 }}>{email}</Text>
        <Text style={{ color: colors.muted }}>{phone}</Text>
        <Text style={{ color: colors.muted }}>{tenantProfile.city}</Text>
      </AppCard>
      <AppButton title="View score" onPress={() => navigation.navigate('TenantScore')} />
      <AppButton title="Verification" onPress={() => navigation.navigate('TenantVerification')} variant="outline" />
      <AppButton title="Settings - Coming Soon" variant="ghost" disabled />
      <AppButton title="Logout" variant="ghost" onPress={logout} />
    </Screen>
  );
}
