import {LogLevel} from './src/Logger';
import {Configuration} from './src/Model/Configuration';

export const config: Configuration = {
  name: 'Default',
  delay: 60000,
  debug: true,
  logLevel: LogLevel.Debug,
  crawler: [],
  notifications: [],
  reporter: [],
  proxies: []
};
