const BACKEND_API = import.meta.env.DEV
  ? import.meta.env.PUBLIC_DEV_API
  : import.meta.env.PUBLIC_RAILWAY_API;

  
const storageLimitGB = 1;
const maxSessions = 3;

export { BACKEND_API, storageLimitGB, maxSessions }
