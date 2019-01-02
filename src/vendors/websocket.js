const HEARTBEAT_TIMEOUT = 10000;
const HEARTBEATSTR = '_heart_beat_';

const getGUID = (function () {
    let id = +new Date();

    return function () {
        return ++id;
    }
})();

export default class {
    constructor(opts) {
        this.url = opts.url;
        this.event = '__websocket_event__' + +new Date();
    }

    reconnect() {
        let ws = this.ws ? this.ws : undefined;
        if (ws) {
            ws.close();
        }
        this.ws = new WebSocket(this.url);
        this.bindEvent();
        this.reset();
    }

    start() {
        this.timeoutObj = setInterval(_ => {
            this.ws.send(HEARTBEATSTR);
        }, HEARTBEAT_TIMEOUT);
    }

    reset() {
        clearTimeout(this.timeoutObj);
        this.start();
    }

    bindEvent() {
        this.ws.addEventListener('message', this.message.bind(this));
        this.ws.addEventListener('error', this.error.bind(this));
        this.ws.addEventListener('close', this.close.bind(this));
    }

    unbindEvent() {
        this.ws.removeEventListener('message', this.message);
        this.ws.removeEventListener('error', this.error);
        this.ws.removeEventListener('close', this.close);
    }

    run(opts) {
        this.reconnect();

        return new Promise(resolve => {
            document.addEventListener(this.event, function (e) {
                console.log(resolve);
                return resolve(e.detail.message);
            });
        });
    }

    message(message) {
        this.reset();

        let event = new CustomEvent(this.event, {
            detail: {
                message: message.data,
            },
        });

        document.dispatchEvent(event);
    }

    error() {
        this.unbindEvent();
        this.reconnect();
        this.reset();
    }

    close() {
        this.unbindEvent();
        this.reconnect();
        this.reset();
    }
}