import { Readable } from 'stream';
import { listOnePageLogResources } from '../api/logs';
import { LogApiResource, Sid, GotClient } from '../types';
import { LogsConfig } from '../types/logs';

export class LogsStream extends Readable {
  _buffer: Array<LogApiResource>;
  _interval: NodeJS.Timeout | undefined;
  pollingFrequency = 1000;
  _viewedSids: Set<Sid>;

  constructor(
    private environmentSid: Sid,
    private serviceSid: Sid,
    private client: GotClient,
    private config: LogsConfig
  ) {
    super({ objectMode: true });
    this._buffer = [];
    this._interval = undefined;
    this._viewedSids = new Set();
  }

  async _poll() {
    try {
      const logs = await listOnePageLogResources(
        this.environmentSid,
        this.serviceSid,
        this.client,
        {
          functionSid: this.config.filterByFunction,
          pageSize: this.config.limit,
        }
      );
      logs
        .filter(log => !this._viewedSids.has(log.sid))
        .reverse()
        .forEach(log => {
          this.push(JSON.stringify(log));
        });
      // Replace the set each time rather than adding to the set.
      // This way the set is always the size of a page of logs and the next page
      // will either overlap or not. This is instead of keeping an ever growing
      // set of viewSids which would cause memory issues for long running log
      // tails.
      this._viewedSids = new Set(logs.map(log => log.sid));
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
