import {Product} from '../Model/Product';
import {Logger} from '../Logger';
import {Region} from '../Model/Region';

export interface CrawlerInterface {
  getRetailerName(): string;

  acquireStock(logger: Logger): Promise<Product[]>;

  getRegion(): Region;
}
