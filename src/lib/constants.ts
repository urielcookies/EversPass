const SITE_URL = import.meta.env.DEV
  ? 'http://localhost:4321'
  : import.meta.env.PUBLIC_PROD_SITE_URL;

const APP_SITE_URL = import.meta.env.DEV
  ? 'http://app.localhost:4321'
  : 'https://app.everspass.com';

const BACKEND_API = import.meta.env.DEV
  ? import.meta.env.PUBLIC_DEV_API
  : import.meta.env.PUBLIC_RAILWAY_API;

const storageLimitGB = 1;
const maxSessions = 3;

export { BACKEND_API, storageLimitGB, maxSessions, SITE_URL, APP_SITE_URL }
