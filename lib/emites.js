/* eslint no-underscore-dangle:
  ["error", { "allow": ["_validateConfig", "_handleRequestError"] }]
*/

const util = require('util');
const axios = require('axios');
const endpoints = require('./endpoints');

const REQUIRED_KEYS = ['host', 'access_token'];

class Emites {
  constructor(config) {
    if (!(this instanceof Emites)) {
      return new Emites(config);
    }
    this.config = config;
    this._validateConfig();
    this.host = config.host;

    const headers = { Authorization: `Token ${config.access_token}` };
    this.credentials = { withCredentials: true, headers };
  }

  getNFCe(organizationId, id) {
    if (!organizationId || !id) {
      throw new TypeError('Function args must have organizationId and id');
    }
    return axios.get(this.host + endpoints.getNFCePath(organizationId, id), this.credentials)
      .then(response => response.data)
      .catch(error => this._handleRequestError(error));
  }

  createNFCeBatch(organizationId, params) {
    if (!organizationId || !params) {
      throw new TypeError('Function args must have organizationId and params');
    }
    return axios.post(this.host + endpoints.createNFCeBatchPath(organizationId),
      params, this.credentials)
      .then(response => response.data)
      .catch(error => this._handleRequestError(error));
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
      if (error.response.status === 422) {
        return error.response.data;
      }
      throw new Error(error.message);
    } else if (error.request) {
      throw new Error('Communicating with Emites failed');
    } else {
      throw new Error(error.message);
    }
  }
}
module.exports = Emites;
