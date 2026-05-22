import * as Keychain from 'react-native-keychain';

const SERVICE = 'com.nivaascred.mobile.auth';
let memoryAccessToken: string | null = null;

interface StoredTokens {
  accessToken: string;
  refreshToken: string;
}

export async function saveTokens(accessToken: string, refreshToken: string) {
  memoryAccessToken = accessToken;
  await Keychain.setGenericPassword('nivaascred', JSON.stringify({ accessToken, refreshToken }), {
    service: SERVICE,
  });
}

export async function getTokens(): Promise<StoredTokens | null> {
  const credentials = await Keychain.getGenericPassword({ service: SERVICE });
  if (!credentials) return null;
  try {
    return JSON.parse(credentials.password) as StoredTokens;
  } catch {
    await clearTokens();
    return null;
  }
}

export async function getAccessToken(): Promise<string | null> {
  if (memoryAccessToken) return memoryAccessToken;
  const tokens = await getTokens();
  memoryAccessToken = tokens?.accessToken ?? null;
  return memoryAccessToken;
}

export async function getRefreshToken(): Promise<string | null> {
  const tokens = await getTokens();
  return tokens?.refreshToken ?? null;
}

export async function clearTokens() {
  memoryAccessToken = null;
  await Keychain.resetGenericPassword({ service: SERVICE });
}
