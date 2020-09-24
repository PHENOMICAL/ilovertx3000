import {Logger} from '../Logger';
import {Crawler} from './Crawler';
import {Region} from '../Model/Region';

export class Evga extends Crawler {
  getRetailerName(): string {
    return 'EVGA Shop';
  }

  getRegion(): Region {
    return Region.Global;
  }

  protected getUrls(): string[] {
    return [
      'https://www.evga.com/products/productlist.aspx?type=0&family=GeForce+30+Series+Family&chipset=RTX+3080',
      'https://www.evga.com/products/productlist.aspx?type=0&family=GeForce+30+Series+Family&chipset=RTX+3090'
    ];
  }

  async acquireStock(logger: Logger) {
    return await this.crawlList(
      '.list-item',
      ($, element) => ({
        name: $(element).find('.pl-list-pname').text().trim(),
        stock: $(element).find('.btnBigAddCart').length ? 'available' : 'Out of Stock',
        url: $(element).find('a').first().attr('href') as string,
      }),
      false,
      logger
    );
  }
}
