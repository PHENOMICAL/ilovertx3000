import {Product} from '../Model/Product';
import {Logger} from '../Logger';
import {Crawler} from './Crawler';
import {Region} from '../Model/Region';
import {Configuration} from '../Model/Configuration';

export class Caseking extends Crawler {
  constructor(private urls: string[]) {
    super();
  }

  getRetailerName(): string {
    return 'Caseking';
  }

  getRegion(): Region {
    return Region.DE;
  }

  protected getUrls(): string[] {
    return this.urls;
  }

  protected productIsValid(product: Product): boolean {
    return super.productIsValid(product) && product.stock !== 'individuell';
  }

  async acquireStock(config: Configuration, logger: Logger) {
    return await this.crawlList(
      '.ck_listing .artbox',
      ($, element) => ({
        name: `${$(element).find('.ProductSubTitle').text().trim()} ${$(element).find('.ProductTitle').text().trim()}`.trim(),
        stock: $(element).find('.frontend_plugins_index_delivery_informations').text().trim(),
        url: $(element).find('a.hover_bg').attr('href') as string
      }),
      false,
      config,
      logger
    );
  }
}
