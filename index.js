require('dotenv').config();
const { getFlag, createAnonymousUserCtx } = require('./featureFlags');

const main = async () => {
  try {
    // const anonymousUserContext = createAnonymousUserCtx();

    const isFeatureEnabled = await getFlag('DarkWeb', 'false');
    console.log(`Is feature enabled for anonymous user: ${isFeatureEnabled}`);

    const isFeatureEnabledw= await getFlag('DarkWeb', 'false');
    console.log(`Is feature enabled for anonymous user: ${isFeatureEnabledw}`);

  } catch (error) {
    console.error('Error with feature flags:', error);
  }
};

main();