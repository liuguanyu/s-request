import axios from "axios";
axios.defaults.baseURL = "/";

export default class {
    constructor(opts) {
        this.opts = opts;
    }

    async run() {
        return await axios(this.opts);
    }
}