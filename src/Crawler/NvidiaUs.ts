import {CrawlerInterface} from './CrawlerInterface';
import cheerio from 'cheerio';
import {Product} from '../Model/Product';
import {Logger} from '../Logger';
import axios from 'axios';

export class NvidiaUs implements CrawlerInterface {
  private products: Product[] = [
    {
      name: 'nVidia GeForce RTX 3080 FE',
      url: 'https://www.nvidia.com/en-us/geforce/graphics-cards/30-series/rtx-3080/'
    },
  ];

  getRetailerName(): string {
    return 'nVidia Shop US';
  }

  async acquireStock(logger: Logger) {
    const products: Product[] = [];
    for await (const product of this.products) {
      try {
        const response = await axios.get(product.url);
        if (response.status !== 200) {
          continue;
        }
        const $          = cheerio.load(response.data);
        product.retailer = this.getRetailerName();
        product.stock    = $('.cta-button').first().text().trim();
        logger.debug(`Acquired stock from ${this.getRetailerName()}`, product);
        products.push(product);
      } catch (e) {
        logger.error(e.message, { url: product.url });
      }
    }
    return products;
  }
}
