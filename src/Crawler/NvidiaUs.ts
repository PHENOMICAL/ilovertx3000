import {Logger} from '../Logger';
import {Region} from '../Model/Region';
import {Nvidia} from './Nvidia';
import {Configuration} from '../Model/Configuration';

export class NvidiaUs extends Nvidia {
  getRegion(): Region {
    return Region.US;
  }

  protected getApiUrls(): Array<{ api: string; productUrl: string }> {
    return [
      // NVIDIA GEFORCE RTX 3080,
      {
        api: 'https://api-prod.nvidia.com/direct-sales-shop/DR/products/en_us/EUR/5438481700',
        productUrl: 'https://www.nvidia.com/en-us/geforce/graphics-cards/30-series/rtx-3080/'
      },
      // NVIDIA GEFORCE RTX 3090
      {
        api: 'https://api-prod.nvidia.com/direct-sales-shop/DR/products/en_us/EUR/5438481600',
        productUrl: 'https://www.nvidia.com/en-us/geforce/graphics-cards/30-series/rtx-3090/'
      }
    ];
  }

  async acquireStock(config: Configuration, logger: Logger) {
    return await super.acquireStock(config, logger);
  }
}
