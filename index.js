require('dotenv').config();
const { getFlag, createAnonymousUserCtx } = require('./featureFlags');

const main = async () => {
  try {
    // const anonymousUserContext = createAnonymousUserCtx();

    const isFeatureEnabled = await getFlag('login-sso', 'false');
    console.log(`Is feature enabled for anonymous user: ${isFeatureEnabled}`);

    const isFeatureEnabledw= await getFlag('acr-api', 'false');
    console.log(`Is feature enabled for anonymous user=> acr: ${isFeatureEnabledw}`);

  } catch (error) {
    console.error('Error with feature flags:', error);
  }
};

main();