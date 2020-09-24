import {Product} from '../Model/Product';
import {Logger} from '../Logger';
import {Crawler} from './Crawler';
import {Region} from '../Model/Region';

export abstract class Nvidia extends Crawler {
  getRetailerName(): string {
    return `nVidia Shop ${this.getRegion()}`;
  }

  protected abstract getApiUrls(): Array<{
    api: string,
    productUrl: string
  }>;

  abstract getRegion(): Region;

  async acquireStock(logger: Logger) {
    const products: Product[] = [];

    for await (const url of this.getApiUrls()) {
      try {
        const response = await this.request(url.api);
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
        products.push(product);
        logger.debug(`Acquired stock from ${this.getRetailerName()}`, products[products.length - 1]);
      } catch (e) {
        logger.error(e.message, {url});
      }
    }
    return products;
  }
}
