import {Product} from '../Model/Product';
import {Logger} from '../Logger';
import {Region} from '../Model/Region';
import {CrawlerStats} from '../Model/CrawlerStats';
import {Configuration} from '../Model/Configuration';

export interface CrawlerInterface {
  getRetailerName(): string;

  acquireStock(config: Configuration, logger: Logger): Promise<Product[]>;

  getRegion(): Region;

  getStats(): CrawlerStats;
}
