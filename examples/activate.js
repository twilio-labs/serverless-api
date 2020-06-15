const { TwilioServerlessApiClient } = require('../dist');
const serviceSid = process.argv[2];
async function run() {
  const config = {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
  };

  const client = new TwilioServerlessApiClient(config);
  console.log('Activating');
  const result = await client.activateBuild({
    ...config,
    env: {},
    serviceSid,
    sourceEnvironment: 'test',
    targetEnvironment: 'stage3',
    createEnvironment: true,
  });
  console.log('Done Activating');
  console.dir(result);
}

run().catch(console.error);
