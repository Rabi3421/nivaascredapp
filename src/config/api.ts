import { Platform } from 'react-native';

const LOCAL_ANDROID = 'http://10.0.2.2:4028/api';
const LOCAL_IOS = 'http://localhost:4028/api';

// Switch this when testing on a physical device or staging backend.
export const API_BASE_URL = Platform.select({
  android: LOCAL_ANDROID,
  ios: LOCAL_IOS,
  default: LOCAL_IOS,
});
