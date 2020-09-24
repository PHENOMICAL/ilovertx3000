import {CrawlerInterface} from './CrawlerInterface';
import cheerio from 'cheerio';
import {Product} from '../Model/Product';
import {Logger} from '../Logger';
import axios from 'axios';

export class Caseking implements CrawlerInterface {
  private readonly urls = [
    'https://www.caseking.de/pc-komponenten/grafikkarten/nvidia/geforce-rtx-3080',
    'https://www.caseking.de/pc-komponenten/grafikkarten/nvidia/geforce-rtx-3090'
  ];

  getRetailerName(): string {
    return 'Caseking';
  }

  async acquireStock(logger: Logger) {
    const products: Product[] = [];
    for await (const url of this.urls) {
      try {
        const response = await axios.get(url);
        const $        = cheerio.load(response.data);
        $('.ck_listing .artbox').each((i, element) => {
          const name  = `${$(element).find('.ProductSubTitle').text().trim()} ${$(element).find('.ProductTitle').text().trim()}`.trim();
          const url   = $(element).find('a.hover_bg').attr('href') as string;
          const stock = $(element).find('.frontend_plugins_index_delivery_informations').text().trim();
          if (!url || name === '' || stock === 'individuell') {
            return;
          }
          products.push({
            name,
            url,
            retailer: this.getRetailerName(),
            stock
          });
          logger.debug(`Acquired stock from ${this.getRetailerName()}`, products[products.length - 1]);
        });
      } catch (e) {
        logger.error(e.message, {url});
      }
    }
    return products;
  }
}
