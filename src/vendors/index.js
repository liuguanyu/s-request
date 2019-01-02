import Http from './http';
import Websocket from './websocket';

export default class {
    getByOpts(opts) {
        if (opts.type) {
            switch (opts.type) {
                case "http":
                case "https":
                    return new Http(opts);
                    break;
                case "ws":
                case "websocket":
                    return new Websocket(opts);
                    break;
            }
        } else {
            if (/^http/.test(opts.url) || /^\/\//.test(opts.url)) {
                return new Http(opts);
            } else if (/^ws/.test(opts.url)) {
                return new Websocket(opts);
            }
        }

        return new Http(opts);
    }
}