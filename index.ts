import {Bot} from './src/Bot';
import {Logger} from './src/Logger';
import {TwitterNotification} from './src/Notification/TwitterNotification';
import {Caseking} from './src/Crawler/Caseking';
import {AlternateDe} from './src/Crawler/AlternateDe';
import {Evga} from './src/Crawler/Evga';
import {NvidiaDe} from './src/Crawler/NvidiaDe';
import {NvidiaUs} from './src/Crawler/NvidiaUs';
import {AmazonCom} from './src/Crawler/AmazonCom';
import {AmazonDe} from './src/Crawler/AmazonDe';
import {DebugNotification} from './src/Notification/DebugNotification';
require('dotenv').config();

const debug = parseInt(process.env.DEBUG as unknown as string) === 1;
const bot = new Bot(process.env.DELAY as unknown as number, [
  new Caseking(),
  new AlternateDe(),
  new Evga(),
  new NvidiaDe(),
  new NvidiaUs(),
  new AmazonDe(),
  new AmazonCom(),
], [
  !debug ? new TwitterNotification(
    process.env.TWITTER_CONSUMER_KEY as string,
    process.env.TWITTER_CONSUMER_SECRET as string,
    process.env.TWITTER_ACCESS_TOKEN_KEY as string,
    process.env.TWITTER_ACCESS_TOKEN_SECRET as string,
  ) : new DebugNotification()
], new Logger(process.env.LOG_LEVEL as unknown as number));

bot.start();
