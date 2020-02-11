/** @module @twilio-labs/serverless-api */

import { Sid } from './serverless-api';

export type LogsConfig = {
  serviceSid: Sid;
  environment: string | Sid;
  tail: boolean;
  limit?: number;
  filterByFunction?: string | Sid;
};
