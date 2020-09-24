import {CrawlerInterface} from './Crawler/CrawlerInterface';
import {Product} from './Model/Product';
import {Logger} from './Logger';
import {NotificationInterface} from './Notification/NotificationInterface';

export class Bot {
  private stock: Product[] = [];

  constructor(
    private readonly delay: number,
    private readonly crawler: CrawlerInterface[],
    private readonly notifications: NotificationInterface[],
    private readonly logger: Logger
  ) {
  }

  async start() {
    this.logger.info(
      `Starting ilovertx3000 ${parseInt(process.env.DEBUG as unknown as string) === 1 ? '[DEBUG]' : ''} with ${this.crawler.length} crawlers (${this.crawler.map(c => c.constructor.name).join(', ')}) and ${this.notifications.length} notification handlers (${this.notifications.map(n => n.constructor.name).join(', ')})`
    );

    if (this.crawler.length === 0) {
      this.logger.info('Nothing to do here...');
      return;
    }

    // noinspection InfiniteLoopJS
    while (true) {
      for await (const crawler of this.crawler) {
        const stock = await crawler.acquireStock(this.logger);
        stock.forEach(product => {
          const existing = this.stock.find(p => p.retailer === product.retailer && p.name === product.name);
          if (!existing) {
            this.stock.push({...product});
            return;
          }
          if (product.stock !== existing.stock) {
            this.handleStockChange(product, existing);
            existing.stock = product.stock;
          }
        });
      }
      this.logger.info(`Items tracked: ${this.stock.length}`);
      await this.sleep(this.delay);
    }
  }

  private handleStockChange(product: Product, previous: Product) {
    this.notifications.forEach(notification => {
        const prev      = previous.stock?.trim();
        const current   = product.stock?.trim();
        const affiliate = product.affiliate ? ' [A]' : '';
        notification.notify(
          `${product.retailer}: Stock changed from "${prev !== '' ? prev : 'unknown'}" to "${current !== '' ? current : 'unknown'}" at ${(new Date()).toISOString()} ${product.url}${affiliate} #rtx3000tracking_region_${product.region}`,
          this.logger
        );
      }
    );
  }

  private async sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
