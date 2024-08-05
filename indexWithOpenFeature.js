const { getFlag } = require('./featureFlagsWithOpenFeature');

require('dotenv').config();

const main = async () => {
  try {
    // const anonymousUserContext = createAnonymousUserCtx();

    const isFeatureEnabled = await getFlag('acr-api', 'false');
    console.log(`Is feature enabled for anonymous user: ${isFeatureEnabled}`);

    const isFeatureEnabledw= await getFlag('acr-api', 'false');
    console.log(`Is feature enabled for anonymous user=> acr: ${isFeatureEnabledw}`);

  } catch (error) {
    console.error('Error with feature flags:');
  }
};

main();