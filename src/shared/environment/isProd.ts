import env from "../../config/env.config";

/**
 * @returns true if the current process is running in a production environment.
 */
export const isProd = (): boolean => {
  return env.environment === 'production';
};
