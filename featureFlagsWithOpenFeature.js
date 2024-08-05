const { OpenFeature } = require('@openfeature/server-sdk');
const { LaunchDarklyProvider } = require('@launchdarkly/openfeature-node-server');
const logger = require('./logger');

const getSdkKeyFromEnvironment = () => {
  switch (process.env.NODE_ENV) {
    case 'production':
      return process.env.LD_SDK_KEY_PRODUCTION;
    case 'staging':
      return process.env.LD_SDK_KEY_STAGING;
    case 'testing':
      return process.env.LD_SDK_KEY_TESTING;
    case 'development':
    default:
      return process.env.LD_SDK_KEY_DEVELOPMENT;
  }
};

let openFeatureApiInitialized = false;

const initOpenFeature = async () => {
  if (!openFeatureApiInitialized) {
    const sdkKey = getSdkKeyFromEnvironment();
    const provider = new LaunchDarklyProvider(sdkKey);

    const ldClient = provider.getClient();

    ldClient.on('ready', () => {
      logger.info('Connected to LaunchDarkly');
    });

    ldClient.on('error', (error) => {
      logger.error('Connection to LaunchDarkly failed:', error);
    });

    ldClient.on('disconnect', () => {
      logger.info('Disconnected from LaunchDarkly');
    });

    await OpenFeature.setProviderAndWait(provider);
    openFeatureApiInitialized = true;
  }
};

const createAnonymousUserCtx = () => {
  return {
    targetingKey: 'anonymous',
  };
};

const getFlag = async (flagKey, defaultValue) => {
  await initOpenFeature();

  const context = createAnonymousUserCtx();
  const client = OpenFeature.getClient();
  const result = await client.getBooleanValue(flagKey, defaultValue, context);

  return result;
};

module.exports = {
    getFlag,
};