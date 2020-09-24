import {Logger} from '../Logger';
import {Region} from '../Model/Region';
import {Crawler} from './Crawler';
import {Product} from '../Model/Product';

export class AmazonCom extends Crawler {
  getRetailerName(): string {
    return 'amazon.com';
  }

  getRegion(): Region {
    return Region.US;
  }

  protected getUrls(): string[] {
    return [
      // PNY GeForce RTX 3080 10GB XLR8
      'https://amzn.to/3iSqIrK',
      // ZOTAC Gaming GeForce RTX 3080 Trinity 10GB
      'https://amzn.to/32PmV8W',
      // PNY GeForce RTX 3080 10GB XLR8
      'https://amzn.to/3mFsU8a',
      // MSI Gaming GeForce RTX 3080
      'https://amzn.to/2RVxlNP',
      // EVGA 10G-P5-3897-KR GeForce RTX 3080 FTW3 ULTRA GAMING
      'https://amzn.to/3mLMn75',
      // EVGA 10G-P5-3895-KR GeForce RTX 3080 FTW3 GAMING
      'https://amzn.to/3hT288N',
      // EVGA 10G-P5-3885-KR GeForce RTX 3080 XC3 ULTRA GAMING
      'https://amzn.to/3mGxQJX',
      // EVGA 10G-P5-3883-KR GeForce RTX 3080 XC3 GAMING
      'https://amzn.to/3kFZ1CY',
      // EVGA 10G-P5-3881-KR GeForce RTX 3080 XC3 BLACK GAMING
      'https://amzn.to/2ROJgx1',
      // GIGABYTE GeForce RTX 3080 Gaming OC
      'https://amzn.to/2HrvSgB',
      // GIGABYTE GeForce RTX 3080 Eagle OC
      'https://amzn.to/3ckC3ON',
      // ASUS TUF Gaming NVIDIA GeForce RTX 3080 OC
      'https://amzn.to/32QiAlM',
      // ASUS TUF Gaming NVIDIA GeForce RTX 3080
      'https://amzn.to/2He0YYH',
      // MSI Gaming GeForce RTX 3080
      'https://amzn.to/33UDAqO',
      // ==========================
      // PNY GeForce RTX 3090
      'https://amzn.to/2EuQof5',
      // PNY GeForce RTX 3090
      'https://amzn.to/3cDFSPn',
      // MSI Gaming GeForce RTX 3090
      'https://amzn.to/3kKOMgB',
      // MSI Gaming GeForce RTX 3090
      'https://amzn.to/3j1yW0v',
      // GIGABYTE GeForce RTX 3090
      'https://amzn.to/2S83WAt',
      // GIGABYTE GeForce RTX 3090
      'https://amzn.to/3j31N4S',
      // ASUS TUF Gaming NVIDIA GeForce RTX 3090
      'https://amzn.to/3csVyF1',
      // ASUS TUF Gaming NVIDIA GeForce RTX 3090
      'https://amzn.to/3cp4kDS',
    ];
  }

  protected productIsValid(product: Product): boolean {
    return super.productIsValid(product) && !product.stock?.startsWith('Available from');
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
