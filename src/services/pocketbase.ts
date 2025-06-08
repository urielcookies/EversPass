import PocketBase from 'pocketbase';

const pb = new PocketBase(import.meta.env.PUBLIC_POCKETBASE_API);

export default pb;