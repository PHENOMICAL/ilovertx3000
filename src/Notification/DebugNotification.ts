import {NotificationInterface} from './NotificationInterface';
import {Logger} from '../Logger';

export class DebugNotification implements NotificationInterface {
  notify(message: string, logger: Logger) {
    logger.debug(`Notification: ${message}`);
  }
}
