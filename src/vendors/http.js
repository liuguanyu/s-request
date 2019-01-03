import axios from 'axios';
axios.defaults.baseURL = '/';

export default class {
    constructor(opts) {
        this.opts = opts;
    }

    async run() {
        let opts = this.opts;
        let params = opts.params ? opts.params : "{}";
        let method = opts.method ? opts.method.toLowerCase() : "get";

        switch (method) {
            case 'post':
                return await axios.post(opts.url, {
                    params
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