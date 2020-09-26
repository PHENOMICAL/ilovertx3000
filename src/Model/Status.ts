import {Product} from './Product';
import {CrawlerStats} from './CrawlerStats';

export interface Status {
  log: {
    created: Date;
  };
  app: {
    started: Date;
    uptime: number;
    delay: number;
    cycles: number;
  };
  stock: Product[];
  crawler: Array<{
    name: string;
    summary: {
      successRate: number;
      requestsTotal: number;
      requestErrors: number;
      avgResponseTime: number;
    };
    details: CrawlerStats;
  }>;
}
