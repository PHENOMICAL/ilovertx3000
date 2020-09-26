import {Product} from './Model/Product';
import {Logger} from './Logger';
import {Configuration} from './Model/Configuration';
import {CrawlerInterface} from './Crawler/CrawlerInterface';

export class Bot {
  protected stock: Product[] = [];
  protected cycles           = 0;
  protected started?: Date;
  private crawlerSummaries: Array<{
    crawler: string;
    summary: {
      successRate: number;
      requestsTotal: number;
      requestErrors: number;
      avgResponseTime: number;
    }
  }>                         = [];

  constructor(
    private readonly config: Configuration,
    private readonly logger: Logger
  ) {
  }

  async start() {
    this.logger.info(`Starting ilovertx3000 with configuration "${this.config.name}"${this.config.debug ? ' in DEBUG mode' : ''}`);
    if (this.config.crawler.length === 0) {
      this.logger.info('Nothing to do here...');
      return;
    }
    this.logger.info(`Crawler (${this.config.crawler.length}): ${this.config.crawler.map(c => c.constructor.name).join(', ')}`);
    this.logger.info(`Notification handler: ${this.config.notifications.length}: ${this.config.notifications.map(c => c.constructor.name).join(', ')}`);

    this.started = new Date();

    // noinspection InfiniteLoopJS
    while (true) {
      await Promise.all(this.config.crawler.map(crawler => this.runCrawler(crawler)));
      this.cycles++;
      this.createReport();
      await this.sleep(this.config.delay);
    }
  }

  private runCrawler(crawler: CrawlerInterface) {
    this.logger.info(`Starting crawler ${crawler.getRetailerName()}`);
    return crawler.acquireStock(this.config, this.logger).then(stock => {
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
    });
  }

  private createReport() {
    this.config.reporter.forEach(reporter => {
      reporter.report({
        log: {
          created: new Date(),
        },
        app: {
          started: this.started ? this.started : new Date(),
          uptime: process.uptime(),
          delay: this.config.delay,
          cycles: this.cycles,
        },
        stock: this.stock,
        crawler: this.config.crawler.map(crawler => {
          return {
            name: crawler.getRetailerName(),
            summary: this.getCrawlerSummary(crawler),
            details: crawler.getStats()
          };
        })
      }, this.logger);
    });
  }

  private getCrawlerSummary(crawler: CrawlerInterface) {
    let existing        = this.crawlerSummaries.find(c => c.crawler === crawler.getRetailerName());
    const stats         = crawler.getStats();
    const requestsTotal = stats.latestCycleRequests.length;
    const requestErrors = stats.latestCycleRequests.filter(r => !r.success).length;
    if (!existing) {
      this.crawlerSummaries.push({
        crawler: crawler.getRetailerName(),
        summary: {
          successRate: 0,
          requestsTotal: 0,
          requestErrors: 0,
          avgResponseTime: 0,
        }
      });
      existing = this.crawlerSummaries[this.crawlerSummaries.length - 1];
    }
    existing.summary.requestsTotal += requestsTotal;
    existing.summary.requestErrors += requestErrors;
    existing.summary.successRate     = (requestsTotal - requestErrors) / requestsTotal;
    existing.summary.avgResponseTime = (existing.summary.avgResponseTime + stats.latestCycleRequests.reduce((previousValue, currentValue) => previousValue + currentValue.responseTime, 0) / stats.latestCycleRequests.length) / 2;
    return existing.summary;
  }

  private handleStockChange(product: Product, previous: Product) {
    const prev      = previous.stock?.trim();
    const current   = product.stock?.trim();
    const affiliate = product.affiliate ? ' [A]' : '';
    const message   = `${product.retailer}: Stock changed from "${prev !== '' ? prev : 'unknown'}" to "${current !== '' ? current : 'unknown'}" at ${(new Date()).toISOString()} ${product.url}${affiliate} #rtx3000tracking_region_${product.region}`;

    if (this.config.debug) {
      this.logger.debug(`Notification: ${message}`);
      return;
    }
    this.config.notifications.forEach(notification => {
        notification.notify(message, this.logger);
      }
    );
  }

  private async sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
