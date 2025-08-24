// import * as Network from 'expo-network';

// export async function getDeviceIp() {
//   const ip = await Network.getIpAddressAsync();
//   return ip;
// }

import Constants from 'expo-constants';

export function getApiBaseUrl() {
  // ✅ In Expo SDK 53, use expoConfig?.hostUri to get Metro dev server IP
  const hostUri = Constants.expoConfig?.hostUri;

  if (hostUri) {
    const host = hostUri.split(':')[0]; // extract only IP/hostname
    return `http://${host}:8081/api`; // 👈 adjust if your API routes differ
  }

  // ✅ Fallback for production (deploy your API here)
  return 'https://api.myapp.com';
}
