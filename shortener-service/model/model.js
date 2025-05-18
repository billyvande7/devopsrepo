export class ShortenRequest {
    constructor(url) {
        this.url = url;
    }
}

export class ShortenResponse {
    constructor(shortKey, baseUrl) {
        this.shortKey = shortKey;
        this.shortenedUrl = `${baseUrl}/${shortKey}`;
    }
}
