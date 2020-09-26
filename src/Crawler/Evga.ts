import {Logger} from '../Logger';
import {Crawler} from './Crawler';
import {Region} from '../Model/Region';
import {Configuration} from '../Model/Configuration';

export class Evga extends Crawler {
  constructor(private urls: string[]) {
    super();
  }

  getRetailerName(): string {
    return 'EVGA Shop';
  }

  getRegion(): Region {
    return Region.Global;
  }

  protected getUrls(): string[] {
    return this.urls;
  }

  async acquireStock(config: Configuration, logger: Logger) {
    return await this.crawlList(
      '.list-item',
      ($, element) => ({
        name: $(element).find('.pl-list-pname').text().trim(),
        stock: $(element).find('.btnBigAddCart').length ? 'available' : 'Out of Stock',
        url: $(element).find('a').first().attr('href') as string,
      }),
      false,
      config,
      logger
    );
  }
}
