import * as SecureStore from 'expo-secure-store'; // For secure token storage

export const sessionStorage = {
  async getAccessToken() {
    return await SecureStore.getItemAsync('accessToken');
  },

  async getRefreshToken() {
    return await SecureStore.getItemAsync('refreshToken');
  },

  async getAuth() {
    const [accessToken, refreshToken] = await Promise.all([
      SecureStore.getItemAsync('accessToken'),
      SecureStore.getItemAsync('refreshToken'),
    ]);
    return { accessToken, refreshToken };
  },

  async deleteAuth() {
    await Promise.all([SecureStore.deleteItemAsync('accessToken'), SecureStore.deleteItemAsync('refreshToken')]);
  },

  async deleteAccessToken() {
    await SecureStore.deleteItemAsync('accessToken');
  },

  async deleteRefreshToken() {
    await SecureStore.deleteItemAsync('refreshToken');
  },

  async setAuth(accessToken: string, refreshToken: string) {
    await Promise.all([
      SecureStore.setItemAsync('accessToken', accessToken),
      SecureStore.setItemAsync('refreshToken', refreshToken),
    ]);
  },

  async setAccessToken(accessToken: string) {
    await SecureStore.setItemAsync('accessToken', accessToken);
  },

  async setRefreshToken(refreshToken: string) {
    await SecureStore.setItemAsync('refreshToken', refreshToken);
  },

  isTokenExpired(expiresAt: Date): boolean {
    return new Date(expiresAt).getTime() < Date.now();
  },

  async isAuthenticated() {
    const { accessToken, refreshToken } = await this.getAuth();
    return accessToken && refreshToken;
  },
};
