const LaunchDarkly = require("@launchdarkly/node-server-sdk");

let launchDarklyClient;
let isInitialized = false;

const init = async () => {
  if (isInitialized) {
    return;
  }

  let sdkKey;

  switch (process.env.NODE_ENV) {
    case 'production':
      sdkKey = process.env.LD_SDK_KEY_PRODUCTION;
      break;
    case 'staging':
      sdkKey = process.env.LD_SDK_KEY_STAGING;
      break;
    case 'testing':
      sdkKey = process.env.LD_SDK_KEY_TESTING;
      break;
    case 'development':
    default:
      sdkKey = process.env.LD_SDK_KEY_DEVELOPMENT;
      break;
  }

  if (!sdkKey) {
    throw new Error(`LaunchDarkly SDK key is not set for environment: ${process.env.NODE_ENV}`);
  }

  launchDarklyClient = LaunchDarkly.init(sdkKey);

  return new Promise((resolve, reject) => {
    launchDarklyClient.on("failed", (err) => {
      console.error("Connection to LaunchDarkly server failed.", err?.message);
      reject("Failed to connect to LaunchDarkly server.");
    });

    launchDarklyClient.once("ready", () => {
      console.log("Connected to LaunchDarkly server.");
      isInitialized = true;
      resolve();
    });

    launchDarklyClient.on("shutdown", (args) => {
      console.log("Disconnected from LaunchDarkly server.", args);
      isInitialized = false;
    });
  });
};

const getFlag = async (featureKey, defaultValue, userContext = createAnonymousUserCtx()) => {
  if (!isInitialized) {
    await init();
  }

  if (!launchDarklyClient || !launchDarklyClient.initialized()) {
    return defaultValue;
  }
  
  return await launchDarklyClient.variation(featureKey, userContext, defaultValue);
};

const createAnonymousUserCtx = () => {
  return {
    key: `anon-${Date.now()}`,
    anonymous: true,
  };
};

module.exports = {
  getFlag,
  createAnonymousUserCtx,
};