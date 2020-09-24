import {Product} from '../Model/Product';
import {Logger} from '../Logger';
import {Crawler} from './Crawler';
import {Region} from '../Model/Region';

export class Caseking extends Crawler {
  getRetailerName(): string {
    return 'Caseking';
  }

  getRegion(): Region {
    return Region.DE;
  }

  protected getUrls(): string[] {
    return [
      'https://www.caseking.de/pc-komponenten/grafikkarten/nvidia/geforce-rtx-3080',
      'https://www.caseking.de/pc-komponenten/grafikkarten/nvidia/geforce-rtx-3090'
    ];
  }

  protected productIsValid(product: Product): boolean {
    return super.productIsValid(product) && product.stock !== 'individuell';
  }

  async acquireStock(logger: Logger) {
    return await this.crawlList(
      '.ck_listing .artbox',
      ($, element) => ({
        name: `${$(element).find('.ProductSubTitle').text().trim()} ${$(element).find('.ProductTitle').text().trim()}`.trim(),
        stock: $(element).find('.frontend_plugins_index_delivery_informations').text().trim(),
        url: $(element).find('a.hover_bg').attr('href') as string
      }),
      false,
      logger
    );
  }
}
