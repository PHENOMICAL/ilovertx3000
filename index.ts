import {Configuration} from './src/Model/Configuration';
import {Bot} from './src/Bot';
import {Logger} from './src/Logger';

const configIndex           = process.argv.findIndex(i => i === '--config');
const configFile            = configIndex >= 0 ? process.argv[configIndex + 1] : 'config';
const config: Configuration = require(`./${configFile}`).config;

(new Bot(config, new Logger(config.logLevel))).start();
