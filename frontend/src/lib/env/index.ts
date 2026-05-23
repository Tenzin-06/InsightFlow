function getRequiredEnv(key: string): string {
  const value = import.meta.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value as string;
}

function getOptionalEnv(key: string, fallback: string): string {
  return (import.meta.env[key] as string | undefined) ?? fallback;
}

export const ENV = {
  API_BASE_URL: getRequiredEnv("VITE_API_BASE_URL"),
  APP_NAME: getRequiredEnv("VITE_APP_NAME"),
  ENVIRONMENT: getRequiredEnv("VITE_ENVIRONMENT"),
  APP_BASE_URL: getOptionalEnv("VITE_APP_BASE_URL", "http://localhost:5173"),
};
