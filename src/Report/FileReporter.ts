import {ReporterInterface} from './ReporterInterface';
import {Status} from '../Model/Status';
import {Logger} from '../Logger';
import * as fs from 'fs';

export class FileReporter implements ReporterInterface {
  constructor(protected file: string) {
  }

  report(status: Status, logger: Logger): void {
    fs.writeFile(this.file, JSON.stringify(status), err => {
      if (err) {
        logger.error('Failed to save log file', err);
        return;
      }
      logger.debug(`Log file ${this.file} saved`);
    });
  }
}
