import axios from 'axios';
axios.defaults.baseURL = '/';

export default class {
    constructor(opts) {
        this.opts = opts;
        if (opts.baseURL) {
            axios.defaults.baseURL = opts.baseURL;
        }
    }

    async run() {
        let opts = this.opts;
        let params = opts.params ? opts.params : "{}";
        let method = opts.method ? opts.method.toLowerCase() : "get";

        switch (method) {
            case 'post':
                return await axios.post(opts.url, params);
                break;
            case 'put':
                return await axios.put(opts.url, params);
                break;
            case 'patch':
                return await axios.patch(opts.url, params);
                break;
            case 'delete':
                return await axios.delete(opts.url, {
                    data: params
                });
                break;
            case 'get':
            default:
                return await axios.get(opts.url, {
                    params
                });
                break;
        }
    }
}