/* eslint no-underscore-dangle:
  ["error", { "allow": ["_validateConfig", "_handleRequestError",
  "_request", "_handleRequestStatusError"] }]
*/

const util = require('util');
const axios = require('axios');
const endpoints = require('./endpoints');
const InvalidTokenError = require('./errors/invalid_token_error');
const ResourceNotFoundError = require('./errors/resource_not_found_error');

const REQUIRED_KEYS = ['access_token'];
const DEFAULT_HOST = 'app.emites.com.br';

class Emites {
  constructor(config) {
    if (!(this instanceof Emites)) {
      return new Emites(config);
    }
    this.config = config;
    this._validateConfig();

    this.baseURL = config.host || DEFAULT_HOST;
    const additionalHeaders = config.headers;
    this.headers = { Authorization: `Token ${config.access_token}` };

    if (additionalHeaders) {
      this.headers = { ...this.headers, ...additionalHeaders };
    }
  }

  /**
  * Returns a specific NFCe
  *
  * @param  {Integer}  Organization ID.
  * @param  {Integer}  NFCe ID.
  */
  async nfce(organizationId, id) {
    this._validateStandardArgs(organizationId, id);

    return this._request('GET', endpoints.getNFCePath(organizationId, id));
  }

  /**
  * Creates NFCe
  *
  * TODO: Describe NFCe params
  *
  * @param  {Integer}  Organization ID.
  * @param  {Object}  NFCe params.
  */
  async createNFCeBatch(organizationId, params) {
    if (!organizationId || !params) {
      throw new TypeError('Function args must have organizationId and params');
    }

    return this._request('POST', endpoints.createNFCeBatchPath(organizationId), params);
  }

  async cancellingNFCe(organizationId, id) {
    this._validateStandardArgs(organizationId, id);

    return this._request('PATCH', endpoints.cancellingNFCePath(organizationId, id));
  }

  async _request(method = 'GET', url = '/', data = {}) {
    try {
      const response = await axios.request({
        method,
        data,
        url,
        baseURL: this.baseURL,
        headers: this.headers,
      });
      return response.data;
    } catch (error) {
      return this._handleRequestError(error);
    }
  }

  _validateConfig() {
    if (typeof this.config !== 'object') {
      throw new TypeError(`config must be object, got ${typeof config}`);
    }

    REQUIRED_KEYS.forEach((reqKey) => {
      if (!this.config[reqKey]) {
        const errMsg = util.format('Emites config must include `%s`.', reqKey);
        throw new Error(errMsg);
      }
    });
  }

  _handleRequestError(error) {
    if (error.response) {
      return this._handleRequestStatusError(error);
    }
    if (error.request) {
      throw new Error('Communicating with Emites failed');
    } else {
      throw new Error(error.message);
    }
  }

  _handleRequestStatusError(error) {
    const { response: { status } } = error;
    if (status === 422) {
      return error.response.data;
    }
    if (status === 401) {
      throw new InvalidTokenError('Invalid Access Token');
    } else if (status === 404) {
      throw new ResourceNotFoundError('Resource Not Found');
    }
    throw new Error(`Unexpected status code received: ${status}`);
  }

  _validateStandardArgs(organizationId, id) {
    if (!organizationId || !id) {
      throw new TypeError('Function args must have organizationId and id');
    }
  }
}
module.exports = Emites;
