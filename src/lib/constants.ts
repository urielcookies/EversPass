const SITE_URL = import.meta.env.DEV
  ? 'http://localhost:4321'
  : import.meta.env.PUBLIC_PROD_SITE_URL;

const BACKEND_API = import.meta.env.DEV
  ? import.meta.env.PUBLIC_DEV_API
  : import.meta.env.PUBLIC_RAILWAY_API;

const storageLimitGB = 1;
const maxSessions = 3;

export { BACKEND_API, storageLimitGB, maxSessions, SITE_URL }
