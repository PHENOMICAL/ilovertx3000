import {Region} from './Region';

export interface Product {
  retailer?: string;
  name?: string;
  url: string;
  stock?: string;
  affiliate?: boolean;
  region: Region;
}
