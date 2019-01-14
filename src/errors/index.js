export class HttpError {
    constructor(message, code, data) {
        this.name = "HttpError";
        this.code = code;
        this.data = data;
    }
}