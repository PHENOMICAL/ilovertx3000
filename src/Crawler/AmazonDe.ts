import {Logger} from '../Logger';
import {Crawler} from './Crawler';
import {Region} from '../Model/Region';
import {Product} from '../Model/Product';

export class AmazonDe extends Crawler {
  getRetailerName(): string {
    return 'amazon.de';
  }

  getRegion() {
    return Region.DE;
  }

  protected getUrls(): string[] {
    return [
      // Gigabyte GeForce RTX 3080 Eagle OC
      'https://amzn.to/3mFTSMR',
      // EVGA GeForce RTX 3080 FTW3 Ultra Gaming
      'https://amzn.to/3hNUGf2',
      // EVGA GeForce RTX 3080 XC3 Ultra Gaming
      'https://amzn.to/32SP3bl',
      // EVGA GeForce RTX 3080 FTW3 Gaming
      'https://amzn.to/2ZYLyOI',
      // EVGA GeForce RTX 3080 XC3 Black Gaming
      'https://amzn.to/3ckCc4A',
      // EVGA GeForce RTX 3080 XC3 Gaming
      'https://amzn.to/3ctHefq',
      // PNY GeForce RTX™ 3080 10GB XLR8 Gaming Epic-X
      'https://amzn.to/3644xeF',
      // Gigabyte GeForce RTX 3080 Gaming OC
      'https://amzn.to/3kHrAzE',
      // ZOTAC Gaming GeForce RTX 3080 Trinity
      'https://amzn.to/3mI4UBl',
      // MSI RTX 3080 Gaming X Trio 10G
      'https://amzn.to/35XGgGN',
      // PNY GeForce RTX™ 3080 10GB XLR8 Gaming Epic-X
      'https://amzn.to/35Yfbn6',
      // MSI RTX 3080 Ventus 3X 10G OC
      'https://amzn.to/32QmUla',
      // ASUS TUF GeForce RTX 3080 10 GB OC
      'https://amzn.to/2FWjWCK',
    ];
  }

  protected productIsValid(product: Product): boolean {
    return super.productIsValid(product) && !product.stock?.startsWith('Erhältlich bei');
  }

  async acquireStock(logger: Logger) {
    return await this.crawlSinglePage(
      $ => ({
        name: $('#productTitle').first().text().trim(),
        stock: $('#availability span').first().text().trim(),
      }),
      true,
      logger
    );
  }
}
