import { includes, isNil } from 'lodash';
import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosResponseHeaders,
  CancelToken,
  CancelTokenSource,
  RawAxiosRequestHeaders,
  RawAxiosResponseHeaders
} from 'axios';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import queryString from 'query-string';

import * as Middlewares from './middlewares';

export interface HttpOptions {
  data?: unknown;
  disableCache?: boolean;
  throwError?: boolean;
  params?: null;
  cancelToken?: CancelToken;
  // Object containing query string params as properties.
  query?: Record<string, string>;
  headers?: RawAxiosRequestHeaders;
}

export interface HttpMiddleware {
  (req: HttpRequest, res: HttpResponse, next: () => Promise<void>): Promise<void>;
}

interface HttpRequest {
  endpoint: string;
  method: string;
  options?: HttpOptions;
}

export interface HttpResponse<T = unknown> {
  response: T | undefined;
  statusText?: string;
  status?: number;
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders;
  success: boolean;
  error?: AxiosError;
  axiosResponse: AxiosResponse<T>;
}

export const getRequestResponseUrl = (httpResponse: HttpResponse<string>) =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  httpResponse.axiosResponse.request?.res?.responseUrl as string;

export class HttpService {
  axios: AxiosInstance;

  middlewares: HttpMiddleware[];

  constructor(axiosInstance?: AxiosInstance) {
    this.axios = axiosInstance ?? axios.create();
    this.middlewares = [];

    this._setupRetryPolicy(this.axios);

    Object.entries(Middlewares).forEach(([, middleware]) => this.registerMiddleware(middleware));
  }

  registerMiddleware(middleware: HttpMiddleware) {
    this.middlewares.push(middleware);
  }

  get cancelToken() {
    return axios.CancelToken.source();
  }

  cancel(cancelToken: CancelTokenSource, message: string) {
    cancelToken.cancel(message);
  }

  get<T>(endpoint: string, options?: HttpOptions) {
    return this.send<T>(endpoint, 'GET', options);
  }

  post<T>(endpoint: string, options?: HttpOptions) {
    return this.send<T>(endpoint, 'POST', options);
  }

  async send<T>(endpoint: string, method: string, options?: HttpOptions) {
    const request = { endpoint, method, options };
    const response = {} as HttpResponse<T>;

    await this._executeMiddleware<T>([...this.middlewares, this._sendRequest.bind(this)], request, response, 0);

    return response;
  }

  async _executeMiddleware<T>(middlewares: HttpMiddleware[], req: HttpRequest, res: HttpResponse<T>, idx: number) {
    const middleware = middlewares[idx];

    if (!isNil(middleware)) {
      await middleware(req, res, () => this._executeMiddleware(middlewares, req, res, idx + 1));
    }
  }

  async _sendRequest<T>(
    { endpoint, method, options = {} }: { endpoint: string; method: string; options?: HttpOptions },
    res: HttpResponse<T>
  ) {
    const url = !isNil(options.query) ? `${endpoint}?${queryString.stringify(options.query)}` : endpoint;

    const optionsHeaders: RawAxiosRequestHeaders = { ...options.headers };

    if (options.disableCache) {
      optionsHeaders['Cache-Control'] = 'no-cache';
      optionsHeaders.Pragma = 'no-cache';
      optionsHeaders.Expires = '-1';
    }

    optionsHeaders['Accept-Encoding'] = 'application/json';

    const request: AxiosRequestConfig = {
      url,
      method: method.toLowerCase(),
      headers: optionsHeaders,
      cancelToken: options.cancelToken,
      data: options.data,
      params: options.params
    };

    const result = await this.axios<T>(request);

    // Avoid having an empty string response when data is empty.
    res.response = !result.data ? undefined : result.data;
    res.status = result.status;
    res.headers = result.headers;
    res.success = true;
    res.axiosResponse = result;
  }

  _setupRetryPolicy(axiosInstance: AxiosInstance) {
    axiosRetry(axiosInstance, {
      retries: 5,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition(error) {
        const ignoredCodes = [400, 401, 403, 404];

        if (error.response?.status) {
          return !includes(ignoredCodes, error.response.status);
        }

        return false;
      }
    });
  }
}

export const DefaultHttpService = new HttpService();

export const ApiHttpService = new HttpService(axios.create({ baseURL: `${import.meta.env.VITE_BACKEND_URL}/api` }));
