import {NotificationInterface} from './NotificationInterface';
import {Logger} from '../Logger';
import Twitter from 'twitter';

export class TwitterNotification implements NotificationInterface {
  private readonly client: Twitter;

  constructor(consumerKey: string, consumerSecret: string, accessTokenKey: string, accessTokenSecret: string) {
    this.client = new Twitter({
      consumer_key: consumerKey,
      consumer_secret: consumerSecret,
      access_token_key: accessTokenKey,
      access_token_secret: accessTokenSecret
    });
  }

  notify(message: string, logger: Logger) {
    logger.debug('Notifying via twitter', {message});
    this.client.post('statuses/update', { status: message }, err => {
      if (err) {
        logger.error(`Twitter Notification failed`, {err});
      }
    });
  }
}
