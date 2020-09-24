import {CrawlerInterface} from './CrawlerInterface';
import cheerio from 'cheerio';
import axios from 'axios';
import {Product} from '../Model/Product';
import {Logger} from '../Logger';

export class AmazonCom implements CrawlerInterface {
  private readonly urls = [
    'https://amzn.to/3iSqIrK',
    'https://amzn.to/32PmV8W',
    'https://amzn.to/3mFsU8a',
    'https://amzn.to/2RVxlNP',
    'https://amzn.to/3mLMn75',
    'https://amzn.to/3hT288N',
    'https://amzn.to/3mGxQJX',
    'https://amzn.to/3kFZ1CY',
    'https://amzn.to/2ROJgx1',
    'https://amzn.to/2HrvSgB',
    'https://amzn.to/3ckC3ON',
    'https://amzn.to/32QiAlM',
    'https://amzn.to/2He0YYH',
    'https://amzn.to/33UDAqO',
    // Playstation 5
    // 'https://amzn.to/2ZXt3dk',
    // 'https://amzn.to/3kBhBMv'
    // RTX 3090
    'https://amzn.to/2EuQof5',
    'https://amzn.to/3cDFSPn',
    'https://amzn.to/3kKOMgB',
    'https://amzn.to/3j1yW0v',
    'https://amzn.to/2S83WAt',
    'https://amzn.to/3j31N4S',
    'https://amzn.to/3csVyF1',
    'https://amzn.to/3cp4kDS',
  ];

  getRetailerName(): string {
    return 'amazon.com';
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
