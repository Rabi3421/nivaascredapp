import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { UserRole } from '../types';
import * as authApi from '../services/auth/authApi';
import { clearTokens, getAccessToken } from '../services/auth/tokenStorage';

interface AuthContextValue {
  user: authApi.AuthUser | null;
  profile: authApi.AuthProfile;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: authApi.RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  devPreviewRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<authApi.AuthUser | null>(null);
  const [profile, setProfile] = useState<authApi.AuthProfile>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = await getAccessToken();
    if (!token) {
      setUser(null);
      setProfile(null);
      return;
    }
    const me = await authApi.getMe();
    setUser(me.user);
    setProfile(me.profile);
  }, []);

  useEffect(() => {
    refreshUser()
      .catch(async () => {
        await clearTokens();
        setUser(null);
        setProfile(null);
      })
      .finally(() => setIsLoading(false));
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    const nextUser = await authApi.login(email, password);
    setUser(nextUser);
    setProfile(null);
  }, []);

  const register = useCallback(async (payload: authApi.RegisterPayload) => {
    const nextUser = await authApi.register(payload);
    setUser(nextUser);
    setProfile(null);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      await clearTokens();
    }
    setUser(null);
    setProfile(null);
  }, []);

  const devPreviewRole = useCallback((role: UserRole) => {
    if (!__DEV__) return;
    setUser({
      _id: `dev-${role}`,
      fullName: role === 'tenant' ? 'Rahul Kumar' : 'Priya Sharma',
      email: `${role}@nivaascred.dev`,
      role,
    });
    setProfile(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      role:
        user?.role === 'tenant' || user?.role === 'landlord'
          ? user.role
          : null,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      register,
      logout,
      refreshUser,
      devPreviewRole,
    }),
    [user, profile, isLoading, login, register, logout, refreshUser, devPreviewRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
