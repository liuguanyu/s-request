import axios from 'axios';

import { HttpError } from '../errors/';

export default class {
	constructor(opts) {
		this.opts = opts;
		let headers = opts['headers'] ? opts['headers'] : {};
		this.axios = axios.create({
			headers,
		});

		if (opts.baseURL) {
			this.axios.defaults.baseURL = opts.baseURL;
		}

		this.axios.interceptors.response.use(
			function(response) {
				return response;
			},
			function(error) {
				let status = error.response.status;
				let err = new HttpError('Error http request', 404, error);

				return Promise.reject(err);
			}
		);
	}

	async run() {
		let opts = this.opts;
		let params = opts.params ? opts.params : undefined;
		let method = opts.method ? opts.method.toLowerCase() : 'get';

		switch (method) {
			case 'post':
				return await this.axios.post(opts.url, params);
				break;
			case 'put':
				return await this.axios.put(opts.url, params);
				break;
			case 'patch':
				return await this.axios.patch(opts.url, params);
				break;
			case 'delete':
				return await this.axios.delete(opts.url, {
					data: params,
				});
				break;
			case 'get':
			default:
				return params && JSON.stringify(params) !== undefined
					? await this.axios.get(opts.url, {
							params,
					  })
					: await this.axios.get(opts.url);
				break;
		}
	}
}
