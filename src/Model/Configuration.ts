import {LogLevel} from '../Logger';
import {NotificationInterface} from '../Notification/NotificationInterface';
import {ReporterInterface} from '../Report/ReporterInterface';
import {CrawlerInterface} from '../Crawler/CrawlerInterface';

export interface Configuration {
  name: string;
  delay: number;
  debug: boolean;
  logLevel: LogLevel;
  crawler: CrawlerInterface[];
  notifications: NotificationInterface[];
  reporter: ReporterInterface[];
  proxies: string[];
}
