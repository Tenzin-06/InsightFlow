function getRequiredEnv(key: string): string {
  const value = import.meta.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value as string;
}

export const ENV = {
  API_BASE_URL: getRequiredEnv("VITE_API_BASE_URL"),
  APP_NAME: getRequiredEnv("VITE_APP_NAME"),
  ENVIRONMENT: getRequiredEnv("VITE_ENVIRONMENT"),
};
