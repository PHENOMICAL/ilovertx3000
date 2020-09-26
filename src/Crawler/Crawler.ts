import {CrawlerInterface} from './CrawlerInterface';
import {Region} from '../Model/Region';
import {Logger} from '../Logger';
import {Product} from '../Model/Product';
import axios from 'axios';
import cheerio from 'cheerio';
import {CrawlerStats} from '../Model/CrawlerStats';
import {HttpStatus} from '../Model/HttpStatus';
import {Configuration} from '../Model/Configuration';

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
  protected stats: CrawlerStats = {
    latestCycleRequests: [],
  }

  getRegion(): Region {
    return Region.Unknown;
  }

  getStats() {
    return this.stats;
  }

  abstract acquireStock(configuration: Configuration, logger: Logger): Promise<Product[]>;

  abstract getRetailerName(): string;

  protected getUrls(): string[] {
    return [];
  }

  protected productIsValid(product: Product): boolean {
    return product.name !== '' && product.url !== '';
  }

  protected async crawlList(listClass: string, productInfo: (cheerio: CheerioStatic, element: CheerioElement) => { name: string, stock: string, url: string }, affiliate: boolean, config: Configuration, logger: Logger) {
    this.resetStats();
    const products: Product[] = [];
    for await (const url of this.getUrls()) {
      try {
        const response = await this.request(url, config.proxies);
        const $        = cheerio.load(response.data);
        $(listClass).each((i, element) => {
          const {name, stock, url} = productInfo($, element);
          const product            = this.createProduct(name, stock, url, affiliate);
          if (!this.productIsValid(product)) {
            logger.warning('Skipped product', {product, url});
            return;
          }
          this.addRequest(
            response.status === HttpStatus.Ok,
            url,
            product,
            response.status,
            response.config.responseTime ? response.config.responseTime : 0
          );
          products.push(product);
          logger.debug(`Acquired stock from ${this.getRetailerName()}`, products[products.length - 1]);
        });
      } catch (e) {
        this.addRequest(false, url, null, e.response.status, e.response.config.responseTime);
        logger.error(e.message, {url});
      }
    }
    return products;
  }

  protected async crawlSinglePage(productInfo: (cheerio: CheerioStatic) => { name: string, stock: string }, affiliate: boolean, config: Configuration, logger: Logger) {
    this.resetStats();
    const products: Product[] = [];
    for await (const url of this.getUrls()) {
      try {
        const response      = await this.request(url, config.proxies);
        const $             = cheerio.load(response.data);
        const {name, stock} = productInfo($);
        const product       = this.createProduct(name, stock, url, affiliate);
        if (!this.productIsValid(product)) {
          logger.warning('Skipped product', {product, url});
          continue;
        }
        this.addRequest(
          response.status === HttpStatus.Ok,
          url,
          product,
          response.status,
          response.config.responseTime ? response.config.responseTime : 0
        );
        products.push(product);
        logger.debug(`Acquired stock from ${this.getRetailerName()}`, products[products.length - 1]);
      } catch (e) {
        this.addRequest(false, url, null, e.response.status, e.response.config.responseTime);
        logger.error(e.message, {url});
      }
    }
    return products;
  }

  protected addRequest(success: boolean, url: string, product: Product | null, code: HttpStatus, responseTime: number) {
    this.stats.latestCycleRequests.push({
      success,
      url,
      product,
      code,
      responseTime,
    });
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

  protected resetStats() {
    this.stats = {
      latestCycleRequests: [],
    }
  }

  protected request(url: string, proxies: string[]) {
    const proxy = this.getRandomProxy(proxies);
    axios.interceptors.request.use(config => {
      config.requestStartTime = Date.now();
      return config;
    });
    axios.interceptors.response.use(response => {
      if (!response.config.requestStartTime) {
        return response;
      }
      response.config.responseTime = Date.now() - response.config.requestStartTime;
      return response;
    });
    return axios.get(url, {
      headers: this.getHeaders(),
      proxy: {
        host: proxy.host,
        port: proxy.port as unknown as number,
        auth: {
          username: proxy.auth.username,
          password: proxy.auth.password
        }
      }
    });
  }

  private getRandomProxy(proxies: string[]) {
    const proxy = proxies[Math.floor(Math.random() * proxies.length)];
    const [host,port,username,password] = proxy.split(':');
    return {
      host,
      port,
      auth: {
        username,
        password
      }
    };
  }

  private getHeaders() {
    return this.headers[Math.floor(Math.random() * this.headers.length)];
  }
}
