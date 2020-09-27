import {Logger} from '../Logger';
import {Crawler} from './Crawler';
import {Region} from '../Model/Region';
import {Configuration} from '../Model/Configuration';

export class Newegg extends Crawler {
  constructor(private urls: string[]) {
    super();
  }

  getRetailerName(): string {
    return 'newegg.com';
  }

  getRegion(): Region {
    return Region.US;
  }

  protected getUrls(): string[] {
    return this.urls;
  }

  async acquireStock(config: Configuration, logger: Logger) {
    return await this.crawlList(
      '.item-cells-wrap .item-cell',
      ($, element) => ({
        name: $(element).find('.item-title').text().trim(),
        stock: $(element).find('.item-promo').text().trim(),
        url: $(element).find('.item-title').first().attr('href') as string,
      }),
      false,
      config,
      logger
    );
  }
}
