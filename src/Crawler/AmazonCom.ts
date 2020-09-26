import {Logger} from '../Logger';
import {Region} from '../Model/Region';
import {Crawler} from './Crawler';
import {Product} from '../Model/Product';
import {Configuration} from '../Model/Configuration';

export class AmazonCom extends Crawler {
  constructor(private urls: string[]) {
    super();
  }

  getRetailerName(): string {
    return 'amazon.com';
  }

  getRegion(): Region {
    return Region.US;
  }

  protected getUrls(): string[] {
    return this.urls;
  }

  protected productIsValid(product: Product): boolean {
    return super.productIsValid(product) && !product.stock?.startsWith('Available from');
  }

  async acquireStock(config: Configuration, logger: Logger) {
    return await this.crawlSinglePage(
      $ => ({
        name: $('#productTitle').first().text().trim(),
        stock: $('#availability span').first().text().trim(),
      }),
      true,
      config,
      logger
    );
  }
}
