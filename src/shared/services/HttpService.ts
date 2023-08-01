/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-unnecessary-type-constraint */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-explicit-any */


/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-dupe-class-members */
import Axios, { AxiosHeaderValue, AxiosInstance, AxiosRequestConfig } from 'axios';
import { StatusCodes } from 'http-status-codes';

import { envBaseUrl } from '../constants/Environment';
import Routes from '../constants/Routes';
import { HttpError } from '../models/HttpError';
// import { LOCAL_STORAGE_USER } from '../store/modules/Auth';->Current


const config: AxiosRequestConfig = {
	baseURL: envBaseUrl,
	headers: {
		'Content-Type': 'application/json'
	}
};

/**
 *
 * Main service to make the requests to the server
 * It's a simple wrapper on Axios api, this ways we can create functions (like upload) and
 * extend axios api to match the project requirements and to have a place about everything
 * regarding the requests
 *
 */
class HttpService {
	protected http: AxiosInstance;
	public accessToken = '';

	public requests = new Map<string, Promise<any>>();

	constructor() {
		this.http = Axios.create(config);

		this.http.interceptors.request.use(async (request: AxiosRequestConfig) => {
			if (this.accessToken) {
				request.headers = {
					...request.headers,
					'accessToken': `${this.accessToken}`
				};
			}
			return request;
		});

		this.http.interceptors.response.use(
			// @ts-expect-error no typoes
			async (response: AxiosResponse<any>) => {
				return response.data.type == ("text/csv" || 'application/octet-stream') ? response : response.data;
			},
			async (error: any) => {
				const httpError: HttpError | null = HttpError.error(error);
				// if (httpError?.statusCode === StatusCodes.UNAUTHORIZED && window.document.location.pathname !== Routes.LoginPage) {
				// 	this.accessToken = ''
				// 	localStorage.removeItem('')
				// 	window.document.location.replace('Current')
				// }
				return await Promise.reject(httpError);
			}
		);
	}

	public get<T> (url: string): Promise<T>;
	public get<T, K extends any> (url: string, params: K): Promise<T>;
	public get<T, K extends any> (url: string, params?: K, config?: AxiosRequestConfig): Promise<T> {
		/**
	*
	* To reuse the same promise in case the same request is done at the same time
	* but in different components/places
	*
	*/
		const requestKey = `${url}${params ? `_${JSON.stringify(params)}` : ''}`;
		const request = this.requests.get(requestKey);
		if (request) {
			return request;
		}
		const axiosConfig: AxiosRequestConfig = { params, ...config };
		this.requests.set(
			requestKey,
			this.http
				.get(url, axiosConfig)
				.finally(() => this.requests.delete(requestKey))
		);

		return this.requests.get(requestKey) as Promise<T>;
	}
	public async post<T, K = any> (
		url: string,
		data?: K,
		config?: AxiosRequestConfig | K
	): Promise<T> {
		if (url.includes('sign-in')) {
			return await this.http.post<T, T>(url, data, config);
		} else {
			return await this.http.post<T, T>(url, data, config);
		}
	}
	public async sing<T, K extends any | AxiosHeaderValue | undefined = any> (
		url: string,
		data: K,
	): Promise<T> {
		return await this.http.post<T, T>(url, data, {
			headers: {
				'Content-Type': 'application/json',
				loginToken: data
			}
		});
	}
	public async put<T, K = any> (
		url: string,
		data?: K,
		config?: AxiosRequestConfig | undefined
	): Promise<T> {
		return await this.http.put<T, T>(url, data, config);
	}

	public async delete<T> (
		url: string,
		config?: AxiosRequestConfig | undefined
	): Promise<T> {
		return await this.http.delete<T, T>(url, config);
	}

	public async patch<T, K = any> (
		url: string,
		data?: K,
		config?: AxiosRequestConfig | undefined
	): Promise<T> {
		return await this.http.patch<T, T>(url, data, config);
	}

	public async upload<T, K = any>(
		method: 'POST' | 'PUT',
		url: string,
		file: any
	): Promise<T> {
		return await this.http.request({
			method,
			url,
			data: file,
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		});
	}
	public async downloadFileCSV<T, K = any,> (
		method: 'POST' | 'GET',
		url: string,
		body?: K
	): Promise<T> {
		return await this.http.request({
			method,
			url,
			data: body,
			responseType: 'blob',
		});
	}
}

export default new HttpService();
