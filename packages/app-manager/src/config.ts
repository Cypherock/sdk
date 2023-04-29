export const getEnvVariable = (key: string, defaultValue?: string): string => {
  const value = process.env[key];

  if (value) return value;
  if (defaultValue) return defaultValue;

  throw new Error(`ENVIREMENT VARIABLE '${key}' NOT SPECIFIED.`);
};

export const config = {
  CY_BASE_URL: getEnvVariable('CY_BASE_URL', 'https://api.cypherock.com'),
};
