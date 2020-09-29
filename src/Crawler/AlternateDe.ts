import {Logger} from '../Logger';
import {Region} from '../Model/Region';
import {Crawler} from './Crawler';
import {Configuration} from '../Model/Configuration';

export class AlternateDe extends Crawler {
  constructor(private urls: string[]) {
    super();
  }

  getRetailerName(): string {
    return 'alternate.de';
  }

  getRegion() {
    return Region.DE;
  }

  protected getUrls(): string[] {
    return this.urls;
  }

  async acquireStock(config: Configuration, logger: Logger) {
    return await this.crawlList(
      '.listingContainer .listRow',
      ($, element) => ({
        name: $(element).find('.description .name').text().trim(),
        stock: $(element).find('.stockStatus').text().trim(),
        url: 'https://www.alternate.de/' + $(element).find('a').first().attr('href') as string,
      }),
      false,
      config,
      logger
    );
  }
}
