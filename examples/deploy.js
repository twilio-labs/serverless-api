const { TwilioServerlessApiClient } = require('../dist');
async function run() {
  const config = {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
  };

  const client = new TwilioServerlessApiClient(config);
  console.log('Deploying');
  await client.deployProject({
    ...config,
    overrideExistingService: true,
    env: {
      AHOY: 'world',
    },
    pkgJson: {},
    serviceName: 'api-demo',
    functionsEnv: 'test',
    functions: [
      {
        name: 'hello-world',
        path: '/hello-world',
        content: `
          exports.handler = function(context, event, callback) {
            callback(null, 'Ahoy: ' + context.AHOY);
          };
        `,
        access: 'public',
      },
    ],
    assets: [
      {
        name: 'my-lib.js',
        path: '/my-lib.js',
        access: 'public',
        content: 'exports.sum = (a, b) => a+b',
      },
    ],
  });
  console.log('Done Deploying');
}

run().catch(console.error);
