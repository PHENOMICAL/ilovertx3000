import {Logger} from '../Logger';
import {Crawler} from './Crawler';
import {Region} from '../Model/Region';
import {Configuration} from '../Model/Configuration';

export class SonyDirect extends Crawler {
  getRetailerName(): string {
    return 'Sony Direct';
  }

  getRegion(): Region {
    return Region.US;
  }

  protected getUrls(): string[] {
    return [
      'https://direct.playstation.com/en-us/consoles/console/playstation5-console.3005816',
      'https://direct.playstation.com/en-us/consoles/console/playstation5-digital-edition-console.3005817'
    ];
  }

  async acquireStock(config: Configuration, logger: Logger) {
    return await this.crawlSinglePage(
      $ => ({
        name: $('h1.sony-text-h1').first().text().trim(),
        stock: this.getStockFromSchema($('link[itemprop="availability"]').attr('href') as string)
      }),
      false,
      config,
      logger
    );
  }

  private getStockFromSchema(schema: string) {
    const split = schema.split('/');
    const stock = split.pop();
    if (stock) {
      return stock;
    }
    return 'unknown';
  }
}
