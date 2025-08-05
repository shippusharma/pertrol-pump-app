export const configs = Object.freeze({
  nodeEnv: process.env.NODE_ENV,
  isProduction: process.env.NODE_ENV === 'production',
  appName: process.env.APP_NAME as string,

  baseUrl: {
    client: process.env.CLIENT_BASE_URL as string,
    server: process.env.SERVER_BASE_URL as string,
    apiVersion: process.env.API_VERSION as string,
  },

  secretAndToken: {
    secretToken: process.env.SECRET_TOKEN as string,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET as string,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET as string,
  },

  db: {
    mongodb: { uri: process.env.MONGODB_URI  as string},
  },
});

export const serverWithApiVersion = `${configs.baseUrl.server}${configs.baseUrl.apiVersion}`;
