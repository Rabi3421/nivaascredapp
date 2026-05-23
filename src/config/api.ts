import { Platform } from 'react-native';

const LOCAL_ANDROID = 'http://10.0.2.2:4028/api';
const LOCAL_IOS = 'http://localhost:4028/api';
const PHYSICAL_DEVICE = 'http://YOUR_LAN_IP:4028/api';
const PRODUCTION = 'https://YOUR_PRODUCTION_DOMAIN/api';

type ApiTarget = 'local' | 'physical-device' | 'production';

// Change this before building for a physical device or production release.
const API_TARGET = 'local' as ApiTarget;

function localBaseUrl() {
  return Platform.select({
    android: LOCAL_ANDROID,
    ios: LOCAL_IOS,
    default: LOCAL_IOS,
  });
}

export const API_BASE_URL =
  API_TARGET === 'production'
    ? PRODUCTION
    : API_TARGET === 'physical-device'
    ? PHYSICAL_DEVICE
    : localBaseUrl();
