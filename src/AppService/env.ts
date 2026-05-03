// console.log('process.env.VITE_APP_ENABLE_MOCK_API', process.env.VITE_APP_ENABLE_MOCK_API);

const env = {
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  assetsPrefix: import.meta.env.VITE_APP_ASSETS_PREFIX,
  uploadURL: import.meta.env.VITE_APP_UPLOAD_BASE_URL,
  enableMockApi: import.meta.env.VITE_APP_ENABLE_MOCK_API === 'true',
};

console.log('env', env);
export const PUBLIC_PATH = import.meta.env.BASE_URL;

export default env;
