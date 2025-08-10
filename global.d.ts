interface IEnvVariables {
  NODE_ENV: 'production' | 'development';
}

declare global {
  // Extending ProcessEnv to include custom environment variables
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    export interface ProcessEnv extends IEnvVariables {}
  }
}
