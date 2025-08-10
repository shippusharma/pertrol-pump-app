import 'dotenv/config';

export default {
  expo: {
    name: process.env.EXPO_PUBLIC_APP_NAME || 'Petrol Pump App',
    slug: 'petrol-pump-app',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'petrol-pump-app',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/images/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.shippugloitel.petrolpumpapp',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: 'com.shippugloitel.petrolpumpapp',
    },
    web: {
      bundler: 'metro',
      output: 'server',
      favicon: './assets/images/favicon.png',
    },
    plugins: ['expo-router'],
    extra: {
      appName: process.env.EXPO_PUBLIC_APP_NAME,
      clientBaseUrl: process.env.CLIENT_BASE_URL,
      serverBaseUrl: process.env.SERVER_BASE_URL,
      apiVersion: process.env.API_VERSION,
      secretToken: process.env.SECRET_TOKEN,
      accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
      refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
      mongodbUri: process.env.MONGODB_DATABASE_URI,
      smtpHost: process.env.SMTP_HOST,
      smtpPort: process.env.SMTP_PORT,
      smtpUser: process.env.SMTP_USER,
      smtpPassword: process.env.SMTP_PASSWORD,
    },
  },
};
