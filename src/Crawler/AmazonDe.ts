import {Logger} from '../Logger';
import {Crawler} from './Crawler';
import {Region} from '../Model/Region';
import {Product} from '../Model/Product';
import {Configuration} from '../Model/Configuration';

export class AmazonDe extends Crawler {
  constructor(private urls: string[]) {
    super();
  }

  getRetailerName(): string {
    return 'amazon.de';
  }

  getRegion() {
    return Region.DE;
  }

  protected getUrls(): string[] {
    return this.urls;
  }

  protected productIsValid(product: Product): boolean {
    return super.productIsValid(product) && !product.stock?.startsWith('Erhältlich bei');
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
