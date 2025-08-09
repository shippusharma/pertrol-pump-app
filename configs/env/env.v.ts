import Constants from 'expo-constants';
import { z } from 'zod';

const envSchema = z.object({
  nodeEnv: z.string().optional(),
  clientBaseUrl: z.url(),
  serverBaseUrl: z.url(),
  apiVersion: z.string(),
  secretToken: z.string(),
  accessTokenSecret: z.string(),
  refreshTokenSecret: z.string(),
  mongoUri: z.url(),
  appName: z.string(),
});

const raw = Constants.expoConfig?.extra;
const parsed = envSchema.safeParse(raw);

if (!parsed.success) throw new Error('Environment validation failed.');

export const configs = Object.freeze({
  nodeEnv: parsed.data.nodeEnv,
  isProduction: parsed.data.nodeEnv === 'production',
  appName: parsed.data.appName,

  baseUrl: {
    client: parsed.data.clientBaseUrl,
    server: parsed.data.serverBaseUrl,
    apiVersion: parsed.data.apiVersion,
  },

  secretAndToken: {
    secretToken: parsed.data.secretToken,
    accessTokenSecret: parsed.data.accessTokenSecret,
    refreshTokenSecret: parsed.data.refreshTokenSecret,
  },

  db: {
    mongodb: { uri: parsed.data.mongoUri },
  },

  email: {
    secretToken: parsed.data.secretToken,
    accessTokenSecret: parsed.data.accessTokenSecret,
    refreshTokenSecret: parsed.data.refreshTokenSecret,
  },
});
