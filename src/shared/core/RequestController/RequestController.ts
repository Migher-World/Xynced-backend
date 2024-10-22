/* eslint-disable etc/no-commented-out-code */
import { AxiosRequestConfig } from 'axios';

import { AxiosRetry, AxiosRetryConfig } from './AxiosRetry';
import { ErrorCode } from '../Error/ErrorCode';
import { RentifyError } from '../Error/RentifyError';
import { getMessageFromApiRequestError, isApiRequestError } from './ApiRequestError';

export interface RequestOptions {
  headers?: { [name: string]: string };
}

/**
 * A controller responsible to handle all requests in Transtify,
 * compatible with browser, nodejJs and react-native
 */
export class RequestController {
  public async request<Data, Response>(config: AxiosRequestConfig<Data>): Promise<Response> {
    const retryConfig: AxiosRetryConfig = {
      maxAttempts: 2,
      allowedMethods: ['GET', 'OPTIONS'],
      allowedResponseStatuses: [204, 408, 413, 429, 500, 502, 503, 504],
    };

    try {
      const response = await AxiosRetry.request<Data, Response>(retryConfig, {
        ...config,
        timeout: 20000,
      });
      return response.data;
    } catch (e) {
      const error = this.makeError(e);
      throw error;
    }
  }

  private makeError(error: unknown): RentifyError {
    if (isApiRequestError(error)) {
      const { status, statusText } = error.response;
      const apiMessage = getMessageFromApiRequestError(error);

      return new RentifyError({
        code: ErrorCode.REQUEST_ERROR,
        message: `Request failed, ${statusText}(${status}): ${apiMessage}`,
        cause: error,
        details: {
          status,
          response: error.response,
        },
      });
    }

    const err = error instanceof Error ? error : new Error(`${error}`);

    return new RentifyError({
      code: ErrorCode.REQUEST_ERROR,
      message: `Request failed: ${err.message}`,
      cause: err,
    });
  }

  public post<Response, Body>(
    url: string,
    searchParams?: Record<string, unknown>,
    body?: Body,
    options?: RequestOptions,
    abortSignal?: AbortController['signal'],
  ): Promise<Response> {
    return this.request<Body, Response>({
      url,
      params: searchParams,
      method: 'POST',
      data: body,
      headers: options?.headers,
      signal: abortSignal,
    });
  }

  public put<Response, Body>(
    url: string,
    searchParams?: Record<string, unknown>,
    body?: Body,
    options?: RequestOptions,
    abortSignal?: AbortController['signal'],
  ): Promise<Response> {
    return this.request<Body, Response>({
      url,
      params: searchParams,
      method: 'PUT',
      data: body,
      headers: options?.headers,
      signal: abortSignal,
    });
  }

  public async get<Response>(
    url: string,
    searchParams?: Record<string, unknown>,
    options?: RequestOptions,
    abortSignal?: AbortController['signal'],
  ): Promise<Response> {
    return this.request<unknown, Response>({
      url,
      params: searchParams,
      method: 'GET',
      headers: options?.headers,
      signal: abortSignal,
    });
  }

  public async delete<Response, Body>(
    url: string,
    searchParams?: Record<string, unknown>,
    body?: Body,
    options?: RequestOptions,
    abortSignal?: AbortController['signal'],
  ): Promise<Response> {
    return this.request<unknown, Response>({
      url,
      params: searchParams,
      method: 'DELETE',
      data: body,
      headers: options?.headers,
      signal: abortSignal,
    });
  }
}

// import { Injectable } from '@nestjs/common';
// import { HttpService } from '@nestjs/axios';
// import { AxiosRequestConfig, AxiosResponse } from 'axios';
// import { catchError, retry } from 'rxjs/operators';
// import { throwError } from 'rxjs';
// import { ErrorCode } from '../Error/ErrorCode';
// import { RentifyError } from '../Error/RentifyError';
// import { getMessageFromApiRequestError, isApiRequestError } from './ApiRequestError';

// export interface RequestOptions {
//   headers?: { [name: string]: string };
// }

// @Injectable()
// export class RequestController {
//   constructor(private readonly httpService: HttpService) {}

//   public async request<Data, Response>(config: AxiosRequestConfig<Data>): Promise<Response> {
//     const retryConfig = {
//       maxAttempts: 2,
//       allowedMethods: ['GET', 'OPTIONS'],
//       allowedResponseStatuses: [204, 408, 413, 429, 500, 502, 503, 504],
//     };

//     return this.httpService
//       .request<Response>({ ...config, timeout: 15000 })
//       .pipe(
//         retry(retryConfig.maxAttempts),
//         catchError((error) => {
//           const RentifyError = this.makeError(error);
//           return throwError(() => RentifyError);
//         }),
//       )
//       .toPromise()
//       .then((response) => response.data);

//       // const result = await lastValueFrom(request);
//       // return result.data;
//   }

//   private makeError(error: unknown): RentifyError {
//     if (isApiRequestError(error)) {
//       const { status, statusText } = error.response;
//       const apiMessage = getMessageFromApiRequestError(error);

//       return new RentifyError({
//         code: ErrorCode.REQUEST_ERROR,
//         message: `Request failed, ${statusText}(${status}): ${apiMessage}`,
//         cause: error,
//         details: {
//           status,
//           response: error.response,
//         },
//       });
//     }

//     const err = error instanceof Error ? error : new Error(`${error}`);

//     return new RentifyError({
//       code: ErrorCode.REQUEST_ERROR,
//       message: `Request failed: ${err.message}`,
//       cause: err,
//     });
//   }

//   public post<Response, Body>(
//     url: string,
//     searchParams?: Record<string, unknown>,
//     body?: Body,
//     options?: RequestOptions,
//     abortSignal?: AbortController['signal'],
//   ): Promise<Response> {
//     return this.request<Body, Response>({
//       url,
//       params: searchParams,
//       method: 'POST',
//       data: body,
//       headers: options?.headers,
//       signal: abortSignal,
//     });
//   }

//   public put<Response, Body>(
//     url: string,
//     searchParams?: Record<string, unknown>,
//     body?: Body,
//     options?: RequestOptions,
//     abortSignal?: AbortController['signal'],
//   ): Promise<Response> {
//     return this.request<Body, Response>({
//       url,
//       params: searchParams,
//       method: 'PUT',
//       data: body,
//       headers: options?.headers,
//       signal: abortSignal,
//     });
//   }

//   public async get<Response>(
//     url: string,
//     searchParams?: Record<string, unknown>,
//     options?: RequestOptions,
//     abortSignal?: AbortController['signal'],
//   ): Promise<Response> {
//     return this.request<unknown, Response>({
//       url,
//       params: searchParams,
//       method: 'GET',
//       headers: options?.headers,
//       signal: abortSignal,
//     });
//   }

//   public async delete<Response, Body>(
//     url: string,
//     searchParams?: Record<string, unknown>,
//     body?: Body,
//     options?: RequestOptions,
//     abortSignal?: AbortController['signal'],
//   ): Promise<Response> {
//     return this.request<unknown, Response>({
//       url,
//       params: searchParams,
//       method: 'DELETE',
//       data: body,
//       headers: options?.headers,
//       signal: abortSignal,
//     });
//   }
// }
