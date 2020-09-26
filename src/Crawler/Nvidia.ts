import {Product} from '../Model/Product';
import {Logger} from '../Logger';
import {Crawler} from './Crawler';
import {Region} from '../Model/Region';
import {HttpStatus} from '../Model/HttpStatus';
import {Configuration} from '../Model/Configuration';

export abstract class Nvidia extends Crawler {
  getRetailerName(): string {
    return `nVidia Shop ${this.getRegion()}`;
  }

  protected abstract getApiUrls(): Array<{
    api: string,
    productUrl: string
  }>;

  abstract getRegion(): Region;

  async acquireStock(config: Configuration, logger: Logger) {
    this.resetStats();
    const products: Product[] = [];
    for await (const url of this.getApiUrls()) {
      try {
        const response = await this.request(url.api, config.proxies);
        const item     = response.data.products.product[0];
        const stock    = item.inventoryStatus.productIsInStock && item.inventoryStatus.status === 'PRODUCT_INVENTORY_IN_STOCK';
        const product  = this.createProduct(
          item.displayName,
          stock ? 'In Stock' : 'Out of Stock',
          url.productUrl,
          false
        );
        if (!this.productIsValid(product)) {
          logger.warning('Skipped product', {product, url})
          continue;
        }
        this.addRequest(
          response.status === HttpStatus.Ok,
          url.api,
          product,
          response.status,
          response.config.responseTime ? response.config.responseTime : 0
        );
        products.push(product);
        logger.debug(`Acquired stock from ${this.getRetailerName()}`, products[products.length - 1]);
      } catch (e) {
        this.addRequest(false, url.api, null, e.response.status, e.response.config.responseTime);
        logger.error(e.message, {url});
      }
    }
    return products;
  }
}
