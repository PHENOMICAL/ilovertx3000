import {AxiosRequestConfig} from "axios";

declare module "axios" {
  interface AxiosRequestConfig {
    requestStartTime?: number;
    responseTime?: number;
  }
}
