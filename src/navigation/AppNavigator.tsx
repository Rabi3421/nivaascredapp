import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type {
  AuthStackParamList,
  LandlordStackParamList,
  LandlordTabParamList,
  TenantStackParamList,
  TenantTabParamList,
} from './types';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import SplashScreen from '../screens/auth/SplashScreen';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import TenantHomeScreen from '../screens/tenant/TenantHomeScreen';
import PropertyListScreen from '../screens/tenant/PropertyListScreen';
import PropertyDetailsScreen from '../screens/tenant/PropertyDetailsScreen';
import TenantApplicationsScreen from '../screens/tenant/TenantApplicationsScreen';
import TenantRentalHistoryScreen from '../screens/tenant/TenantRentalHistoryScreen';
import TenantReviewsScreen from '../screens/tenant/TenantReviewsScreen';
import TenantScoreScreen from '../screens/tenant/TenantScoreScreen';
import TenantVerificationScreen from '../screens/tenant/TenantVerificationScreen';
import TenantProfileScreen from '../screens/tenant/TenantProfileScreen';
import LandlordHomeScreen from '../screens/landlord/LandlordHomeScreen';
import LandlordPropertiesScreen from '../screens/landlord/LandlordPropertiesScreen';
import AddEditPropertyScreen from '../screens/landlord/AddEditPropertyScreen';
import LandlordTenantRequestsScreen from '../screens/landlord/LandlordTenantRequestsScreen';
import LandlordRentalHistoryScreen from '../screens/landlord/LandlordRentalHistoryScreen';
import LandlordReviewsScreen from '../screens/landlord/LandlordReviewsScreen';
import LandlordScoreScreen from '../screens/landlord/LandlordScoreScreen';
import LandlordVerificationScreen from '../screens/landlord/LandlordVerificationScreen';
import LandlordProfileScreen from '../screens/landlord/LandlordProfileScreen';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const TenantStack = createNativeStackNavigator<TenantStackParamList>();
const LandlordStack = createNativeStackNavigator<LandlordStackParamList>();
const TenantTabs = createBottomTabNavigator<TenantTabParamList>();
const LandlordTabs = createBottomTabNavigator<LandlordTabParamList>();

function screenOptions() {
  return {
    headerShown: false,
    contentStyle: { backgroundColor: colors.background },
  };
}

function tabOptions() {
  return {
    headerShown: false,
    tabBarActiveTintColor: colors.primary,
    tabBarInactiveTintColor: colors.muted,
    tabBarStyle: {
      backgroundColor: colors.surface,
      borderTopColor: colors.border,
      minHeight: 62,
      paddingTop: 8,
      paddingBottom: 8,
    },
    tabBarLabelStyle: { fontSize: 11, fontWeight: '700' as const },
  };
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={screenOptions()}>
      <AuthStack.Screen name="Splash" component={SplashScreen} />
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </AuthStack.Navigator>
  );
}

function TenantTabNavigator() {
  return (
    <TenantTabs.Navigator screenOptions={tabOptions()}>
      <TenantTabs.Screen name="TenantHome" component={TenantHomeScreen} options={{ title: 'Home', tabBarIcon: () => null }} />
      <TenantTabs.Screen name="PropertyList" component={PropertyListScreen} options={{ title: 'Properties', tabBarIcon: () => null }} />
      <TenantTabs.Screen name="TenantApplications" component={TenantApplicationsScreen} options={{ title: 'Applications', tabBarIcon: () => null }} />
      <TenantTabs.Screen name="TenantScore" component={TenantScoreScreen} options={{ title: 'Score', tabBarIcon: () => null }} />
      <TenantTabs.Screen name="TenantProfile" component={TenantProfileScreen} options={{ title: 'Profile', tabBarIcon: () => null }} />
    </TenantTabs.Navigator>
  );
}

function TenantNavigator() {
  return (
    <TenantStack.Navigator screenOptions={screenOptions()}>
      <TenantStack.Screen name="TenantTabs" component={TenantTabNavigator} />
      <TenantStack.Screen name="PropertyDetails" component={PropertyDetailsScreen} />
      <TenantStack.Screen name="TenantRentalHistory" component={TenantRentalHistoryScreen} />
      <TenantStack.Screen name="TenantReviews" component={TenantReviewsScreen} />
      <TenantStack.Screen name="TenantVerification" component={TenantVerificationScreen} />
    </TenantStack.Navigator>
  );
}

function LandlordTabNavigator() {
  return (
    <LandlordTabs.Navigator screenOptions={tabOptions()}>
      <LandlordTabs.Screen name="LandlordHome" component={LandlordHomeScreen} options={{ title: 'Home', tabBarIcon: () => null }} />
      <LandlordTabs.Screen name="LandlordProperties" component={LandlordPropertiesScreen} options={{ title: 'Properties', tabBarIcon: () => null }} />
      <LandlordTabs.Screen name="LandlordTenantRequests" component={LandlordTenantRequestsScreen} options={{ title: 'Requests', tabBarIcon: () => null }} />
      <LandlordTabs.Screen name="LandlordScore" component={LandlordScoreScreen} options={{ title: 'Score', tabBarIcon: () => null }} />
      <LandlordTabs.Screen name="LandlordProfile" component={LandlordProfileScreen} options={{ title: 'Profile', tabBarIcon: () => null }} />
    </LandlordTabs.Navigator>
  );
}

function LandlordNavigator() {
  return (
    <LandlordStack.Navigator screenOptions={screenOptions()}>
      <LandlordStack.Screen name="LandlordTabs" component={LandlordTabNavigator} />
      <LandlordStack.Screen name="AddEditProperty" component={AddEditPropertyScreen} />
      <LandlordStack.Screen name="LandlordRentalHistory" component={LandlordRentalHistoryScreen} />
      <LandlordStack.Screen name="LandlordReviews" component={LandlordReviewsScreen} />
      <LandlordStack.Screen name="LandlordVerification" component={LandlordVerificationScreen} />
    </LandlordStack.Navigator>
  );
}

export default function AppNavigator() {
  const { role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!role ? (
        <AuthNavigator />
      ) : role === 'tenant' ? (
        <TenantNavigator />
      ) : (
        <LandlordNavigator />
      )}
    </NavigationContainer>
  );
}
