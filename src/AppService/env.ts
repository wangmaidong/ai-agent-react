const env = {
  baseURL: process.env.REACT_APP_BASE_URL,
  assetsPrefix: process.env.REACT_APP_ASSETS_PREFIX,
  uploadURL: process.env.REACT_APP_UPLOAD_BASE_URL,
  enableMockApi: process.env.REACT_APP_ENABLE_MOCK_API === 'true',
};

console.log("env", env);

export default env;
