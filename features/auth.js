const authConfig = {
  region: process.env.NEXT_PUBLIC_COGNITO_REGION,
  identityPoolId: process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID,
  userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
  userPoolWebClientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_WEB_CLIENT_ID,
};

const apiConfig = {
  endpoints: [
    {
      name: process.env.NEXT_PUBLIC_SERVERLESS_TIME_TRACKER_SERVICE_NAME,
      endpoint: process.env.NEXT_PUBLIC_SERVERLESS_TIME_TRACKER_SERVICE,
      region: process.env.NEXT_PUBLIC_SERVERLESS_TIME_TRACKER_SERVICE_REGION,
    },
  ],
};

export default {
  Auth: authConfig,
  API: apiConfig,
};
