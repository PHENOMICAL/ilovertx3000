import {Product} from './Product';
import {HttpStatus} from './HttpStatus';

export interface CrawlerStats {
  latestCycleRequests: Array<{
    success: boolean;
    url: string;
    responseTime: number;
    code: HttpStatus;
    product: Product | null;
  }>;
}
