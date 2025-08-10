import Constants from 'expo-constants';

export const configs = Object.freeze({
  nodeEnv: process.env.NODE_ENV,
  isProduction: process.env.NODE_ENV === 'production',
  appName: Constants.expoConfig?.extra?.appName,

  baseUrl: {
    client: Constants.expoConfig?.extra?.clientBaseUrl,
    server: Constants.expoConfig?.extra?.serverBaseUrl,
    apiVersion: Constants.expoConfig?.extra?.apiVersion,
  },

  secretAndToken: {
    secretToken: Constants.expoConfig?.extra?.secretToken,
    accessTokenSecret: Constants.expoConfig?.extra?.accessTokenSecret,
    refreshTokenSecret: Constants.expoConfig?.extra?.refreshTokenSecret,
  },

  db: {
    uri: Constants.expoConfig?.extra?.mongodbUri,
  },

  email: {
    host: Constants.expoConfig?.extra?.smtpHost,
    port: Number(Constants.expoConfig?.extra?.smtpPort || 587),
    user: Constants.expoConfig?.extra?.smtpUser,
    password: Constants.expoConfig?.extra?.smtpPassword,
  },
});

export const serverWithApiVersion = `${configs.baseUrl.server}${configs.baseUrl.apiVersion}`;
