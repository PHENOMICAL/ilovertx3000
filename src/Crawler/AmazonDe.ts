import {CrawlerInterface} from './CrawlerInterface';
import cheerio from 'cheerio';
import axios from 'axios';
import {Product} from '../Model/Product';
import {Logger} from '../Logger';

export class AmazonDe implements CrawlerInterface {
  private readonly urls = [
    'https://amzn.to/3mFTSMR',
    'https://amzn.to/3hNUGf2',
    'https://amzn.to/32SP3bl',
    'https://amzn.to/2ZYLyOI',
    'https://amzn.to/3ckCc4A',
    'https://amzn.to/3ctHefq',
    'https://amzn.to/3644xeF',
    'https://amzn.to/3kHrAzE',
    'https://amzn.to/3mI4UBl',
    'https://amzn.to/35XGgGN',
    'https://amzn.to/35Yfbn6',
    'https://amzn.to/32QmUla',
    'https://amzn.to/2FWjWCK',
    // Playstation 5
    // 'https://amzn.to/345FxkD',
    // 'https://amzn.to/3mLhEHx'
  ];

  getRetailerName(): string {
    return 'amazon.de';
  }

  async acquireStock(logger: Logger) {
    const products: Product[] = [];
    for await (const url of this.urls) {
      try {
        const response = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
          }
        });
        const $        = cheerio.load(response.data);
        const name     = $('#productTitle').first().text().trim();
        const stock    = $('#availability span').first().text().trim();
        if (name === '') {
          continue;
        }
        products.push({
          name,
          url,
          stock,
          retailer: this.getRetailerName(),
          affiliate: true
        });
        logger.debug(`Acquired stock from ${this.getRetailerName()}`, products[products.length - 1]);
      } catch (e) {
        logger.error(e.message, {url});
      }
    }
    return products;
  }
}
