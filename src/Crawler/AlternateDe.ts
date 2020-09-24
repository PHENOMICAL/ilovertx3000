import {CrawlerInterface} from './CrawlerInterface';
import cheerio from 'cheerio';
import axios from 'axios';
import {Product} from '../Model/Product';
import {Logger} from '../Logger';

export class AlternateDe implements CrawlerInterface {
  private readonly urls = [
    'https://www.alternate.de/Grafikkarten/RTX-3080',
    'https://www.alternate.de/Grafikkarten/RTX-3090'
  ];

  getRetailerName(): string {
    return 'alternate.de';
  }

  async acquireStock(logger: Logger) {
    const products: Product[] = [];
    for await (const url of this.urls) {
      try {
        const response = await axios.get(url);
        const $        = cheerio.load(response.data);
        $('.listingContainer .listRow').each((i, element) => {
          const name = $(element).find('.description .name').text().trim();
          const stock = $(element).find('.stockStatus').text().trim();
          const url = $(element).find('a').first().attr('href');
          if (!url || name === '') {
            return;
          }
          products.push({
            name,
            stock,
            retailer: this.getRetailerName(),
            url: `https://www.alternate.de${url}`
          });
          logger.debug(`Acquired stock from ${this.getRetailerName()}`, products[products.length - 1]);
        });
      } catch (e) {
        logger.error(e.message, { url });
      }
    }
    return products;
  }
}
