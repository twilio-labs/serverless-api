import { Readable } from 'stream';
import { listOnePageLogResources } from '../api/logs';
import { LogApiResource, Sid, GotClient } from '../types';
import { ClientConfig } from '../types/client';
import { createGotClient } from '../client';

export class LogStream extends Readable {
  _buffer: Array<LogApiResource>;
  _interval: NodeJS.Timeout | undefined;
  client: GotClient;
  pollingFrequency = 1000;
  _viewedSids: Set<Sid>;

  constructor(
    private environmentSid: Sid,
    private serviceSid: Sid,
    clientConfig: ClientConfig
  ) {
    super({ objectMode: true });
    this._buffer = [];
    this._interval = undefined;
    this._viewedSids = new Set();
    this.client = createGotClient(clientConfig);
  }

  async _poll() {
    try {
      const logs = await listOnePageLogResources(
        this.environmentSid,
        this.serviceSid,
        this.client
      );
      logs
        .filter(log => !this._viewedSids.has(log.sid))
        .forEach(log => {
          this._viewedSids.add(log.sid);
          this.push(JSON.stringify(log));
        });
    } catch (err) {
      this.destroy(err);
    }
  }

  _read() {
    if (!this._interval) {
      this._interval = setInterval(() => {
        this._poll();
      }, this.pollingFrequency);
    }
  }

  _destroy() {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = undefined;
    }
  }
}
