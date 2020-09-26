import {Status} from '../Model/Status';
import {Logger} from '../Logger';

export interface ReporterInterface {
  report(status: Status, logger: Logger): void;
}
