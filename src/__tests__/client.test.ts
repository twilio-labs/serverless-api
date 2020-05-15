import { createGotClient } from '../client';
import { DEFAULT_TEST_CLIENT_CONFIG } from '../__fixtures__/base-fixtures';

describe('createGotClient', () => {
  test('works with default configuration', () => {
    const config = DEFAULT_TEST_CLIENT_CONFIG;
    const client = createGotClient(config);
    const options = client.defaults.options;
    expect(options.prefixUrl).toBe('https://serverless.twilio.com/v1/');
    expect(options.responseType).toBe('json');
    expect((options as any).username).toBe(
      DEFAULT_TEST_CLIENT_CONFIG.accountSid
    );
    expect((options as any).password).toBe(
      DEFAULT_TEST_CLIENT_CONFIG.authToken
    );
    expect(client.twilioClientConfig).toEqual(config);
  });

  test('works with region configuration', () => {
    const config = {
      ...DEFAULT_TEST_CLIENT_CONFIG,
      region: 'dev',
    };
    const client = createGotClient(config);
    const options = client.defaults.options;
    expect(options.prefixUrl).toBe('https://serverless.dev.twilio.com/v1/');
    expect(options.responseType).toBe('json');
    expect((options as any).username).toBe(
      DEFAULT_TEST_CLIENT_CONFIG.accountSid
    );
    expect((options as any).password).toBe(
      DEFAULT_TEST_CLIENT_CONFIG.authToken
    );
    expect(client.twilioClientConfig).toEqual(config);
  });

  test('works with region & edge configuration', () => {
    const config = {
      ...DEFAULT_TEST_CLIENT_CONFIG,
      edge: 'sydney',
      region: 'au1',
    };
    const client = createGotClient(config);
    const options = client.defaults.options;
    expect(options.prefixUrl).toBe(
      'https://serverless.sydney.au1.twilio.com/v1/'
    );
    expect(options.responseType).toBe('json');
    expect((options as any).username).toBe(
      DEFAULT_TEST_CLIENT_CONFIG.accountSid
    );
    expect((options as any).password).toBe(
      DEFAULT_TEST_CLIENT_CONFIG.authToken
    );
    expect(client.twilioClientConfig).toEqual(config);
  });
});
