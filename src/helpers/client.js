let fetch;
if (typeof window !== 'undefined' && window.fetch) {
  ({ fetch } = window);
} else {
  fetch = require('cross-fetch'); // eslint-disable-line global-require
}

class Client {
  constructor(address, defaultOptions = {}) {
    if (typeof address !== 'string') throw new Error('InvalidArgument: address has to ba a string');
    if (typeof defaultOptions !== 'object')
      throw new Error('InvalidArgument: defaultOptions has to be an object');

    this.address = address;

    this.options = {
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      ...defaultOptions,
    };

    this.fetchUrl = this.fetchUrl.bind(this);
  }

  getUrl(url) {
    return fetch(this.address + url, {
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
  }

  fetchUrl(url, request) {
    return fetch(this.address + url, {
      body: request.body || {},
      credentials: request.credentials || 'same-origin',
      headers: request.headers || {},
      method: request.method || {},
      mode: request.mode || 'cors',
    });
  }

}

export default Client;