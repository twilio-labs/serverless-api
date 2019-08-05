/** @module @twilio-labs/serverless-api */

import { ClientConfig } from './client';
import { Sid } from './serverless-api';

export type LogsConfig = ClientConfig & {
  serviceSid: Sid;
  environment: string | Sid;
  tail: boolean;
  limit?: number;
  filterByFunction?: string | Sid;
};
