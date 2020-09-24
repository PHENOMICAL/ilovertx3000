import {Logger} from '../Logger';
import {Region} from '../Model/Region';
import {Nvidia} from './Nvidia';

export class NvidiaDe extends Nvidia {
  getRegion(): Region {
    return Region.DE;
  }

  protected getApiUrls(): Array<{ api: string; productUrl: string }> {
    return [
      // NVIDIA GEFORCE RTX 3080,
      {
        api: 'https://api-prod.nvidia.com/direct-sales-shop/DR/products/de_de/EUR/5438792300',
        productUrl: 'https://www.nvidia.com/de-de/geforce/graphics-cards/30-series/rtx-3080/'
      },
      // NVIDIA GEFORCE RTX 3090
      {
        api: 'https://api-prod.nvidia.com/direct-sales-shop/DR/products/de_de/EUR/5438761400',
        productUrl: 'https://www.nvidia.com/de-de/geforce/graphics-cards/30-series/rtx-3090/'
      }
    ];
  }

  async acquireStock(logger: Logger) {
    return await super.acquireStock(logger);
  }
}
