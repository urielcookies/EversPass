const BACKEND_API = import.meta.env.DEV
  ? import.meta.env.PUBLIC_DEV_API
  : import.meta.env.PUBLIC_RAILWAY_API;

export { BACKEND_API }
