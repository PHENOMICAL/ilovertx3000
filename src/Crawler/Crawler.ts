import {CrawlerInterface} from './CrawlerInterface';
import {Region} from '../Model/Region';
import {Logger} from '../Logger';
import {Product} from '../Model/Product';
import axios from 'axios';
import cheerio from 'cheerio';

export abstract class Crawler implements CrawlerInterface {
  protected headers = [
    {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:77.0) Gecko/20100101 Firefox/77.0",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Referer": "https://www.google.com/",
      "DNT": "1",
      "Connection": "keep-alive",
      "Upgrade-Insecure-Requests": "1"
    },
    {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:77.0) Gecko/20100101 Firefox/77.0",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate, br",
      "Referer": "https://www.google.com/",
      "DNT": "1",
      "Connection": "keep-alive",
      "Upgrade-Insecure-Requests": "1"
    },
    {
      "Connection": "keep-alive",
      "DNT": "1",
      "Upgrade-Insecure-Requests": "1",
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Dest": "document",
      "Referer": "https://www.google.com/",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8"
    },
    {
      "Connection": "keep-alive",
      "Upgrade-Insecure-Requests": "1",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "Sec-Fetch-Site": "same-origin",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-User": "?1",
      "Sec-Fetch-Dest": "document",
      "Referer": "https://www.google.com/",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "en-US,en;q=0.9"
    }
  ];

  getRegion(): Region {
    return Region.Unknown;
  }

  abstract acquireStock(logger: Logger): Promise<Product[]>;

  abstract getRetailerName(): string;

  protected getUrls(): string[] {
    return [];
  }

  protected productIsValid(product: Product): boolean {
    return product.name !== '' && product.url !== '';
  }

  protected async crawlList(listClass: string, productInfo: (cheerio: CheerioStatic, element: CheerioElement) => { name: string, stock: string, url: string }, affiliate: boolean, logger: Logger) {
    const products: Product[] = [];
    for await (const url of this.getUrls()) {
      try {
        const response = await this.request(url);
        const $        = cheerio.load(response.data);
        $(listClass).each((i, element) => {
          const {name, stock, url} = productInfo($, element);
          const product            = this.createProduct(name, stock, url, affiliate);
          if (!this.productIsValid(product)) {
            logger.warning('Skipped product', {product, url});
            return;
          }
          products.push(product);
          logger.debug(`Acquired stock from ${this.getRetailerName()}`, products[products.length - 1]);
        });
      } catch (e) {
        logger.error(e.message, {url});
      }
    }
    return products;
  }

  protected async crawlSinglePage(productInfo: (cheerio: CheerioStatic) => { name: string, stock: string }, affiliate: boolean, logger: Logger) {
    const products: Product[] = [];
    for await (const url of this.getUrls()) {
      try {
        const response      = await this.request(url);
        const $             = cheerio.load(response.data);
        const {name, stock} = productInfo($);
        const product       = this.createProduct(name, stock, url, affiliate);
        if (!this.productIsValid(product)) {
          logger.warning('Skipped product', {product, url});
          continue;
        }
        products.push(product);
        logger.debug(`Acquired stock from ${this.getRetailerName()}`, products[products.length - 1]);
      } catch (e) {
        logger.error(e.message, {url});
      }
    }
    return products;
  }

  protected createProduct(name: string, stock: string, url: string, affiliate = false): Product {
    return {
      name,
      stock,
      url,
      affiliate,
      region: this.getRegion(),
      retailer: this.getRetailerName(),
    };
  }

  protected request(url: string) {
    return axios.get(url, {
      headers: this.getHeaders()
    });
  }

  private getHeaders() {
    return this.headers[Math.floor(Math.random() * this.headers.length)];
  }
}
