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

    /* eslint no-underscore-dangle: ["error", { "allow": ["_validateConfig"] }] */
    this._validateConfig();

    this.host = config.host;

    const headers = { Authorization: `Token ${config.access_token}` };
    this.credentials = { withCredentials: true, headers };
  }

  getNFCe(organizationId, id) {
    return axios.get(this.host + endpoints.getNFCePath(organizationId, id), this.credentials)
      .then(response => response.data)
      .catch(error => error.response.data);
  }

  createNFCeBatch(organizationId, params) {
    return axios.post(this.host + endpoints.createNFCeBatchPath(organizationId),
      params, this.credentials).then(response => response.data)
      .catch(error => error.response.data);
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
}
module.exports = Emites;
