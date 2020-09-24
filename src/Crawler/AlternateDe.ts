import {Logger} from '../Logger';
import {Region} from '../Model/Region';
import {Crawler} from './Crawler';

export class AlternateDe extends Crawler {
  getRetailerName(): string {
    return 'alternate.de';
  }

  getRegion() {
    return Region.DE;
  }

  protected getUrls(): string[] {
    return [
      'https://www.alternate.de/Grafikkarten/RTX-3080',
      'https://www.alternate.de/Grafikkarten/RTX-3090'
    ];
  }

  async acquireStock(logger: Logger) {
    return await this.crawlList(
      '.listingContainer .listRow',
      ($, element) => ({
        name: $(element).find('.description .name').text().trim(),
        stock: $(element).find('.stockStatus').text().trim(),
        url: $(element).find('a').first().attr('href') as string,
      }),
      false,
      logger
    );
  }
}
