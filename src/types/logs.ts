/** @module @twilio-labs/serverless-api */

import { Sid } from './serverless-api';
import { GotClient } from './generic';

export type LogsConfig = {
  serviceSid: Sid;
  environment: string | Sid;
  tail: boolean;
  limit?: number;
  filterByFunction?: string | Sid;
};
