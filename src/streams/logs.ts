import { Readable } from 'stream';
import { listOnePageLogResources } from '../api/logs';
import { LogApiResource, Sid, GotClient } from '../types';
import { createGotClient } from '../client';
import { LogsConfig } from '../types/logs';

export class LogsStream extends Readable {
  _buffer: Array<LogApiResource>;
  _interval: NodeJS.Timeout | undefined;
  client: GotClient;
  pollingFrequency = 1000;
  _viewedSids: Set<Sid>;

  constructor(
    private environmentSid: Sid,
    private serviceSid: Sid,
    private config: LogsConfig
  ) {
    super({ objectMode: true });
    this._buffer = [];
    this._interval = undefined;
    this._viewedSids = new Set();
    this.client = createGotClient(config);
  }

  async _poll() {
    try {
      const logs = await listOnePageLogResources(
        this.environmentSid,
        this.serviceSid,
        this.client,
        this.config.limit,
        this.config.filterByFunction
      );
      logs
        .filter(log => !this._viewedSids.has(log.sid))
        .forEach(log => {
          this._viewedSids.add(log.sid);
          this.push(JSON.stringify(log));
        });
      if (!this.config.tail) {
        this.push(null);
      }
    } catch (err) {
      this.destroy(err);
    }
  }

  _read() {
    if (this.config.tail && !this._interval) {
      this._interval = setInterval(() => {
        this._poll();
      }, this.pollingFrequency);
    } else {
      this._poll();
    }
  }

  _destroy() {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = undefined;
    }
  }
}
