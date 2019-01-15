const axios = require('axios');
const endpoints = require('./endpoints');

class Emites {
  constructor(config) {
    if (!(this instanceof Emites)) {
      return new Emites(config);
    }

    this.host = config.host;

    const headers = { Authorization: `Token ${config.accessToken}` };
    this.credentials = { withCredentials: true, headers };
  }

  getNFCe(organizationId, id) {
    return axios.get(this.host + endpoints.getNFCePath(organizationId, id), this.credentials);
  }

  createNFCeBatch(organizationId, params) {
    return axios.post(this.host + endpoints.createNFCeBatchPath(organizationId),
      params, this.credentials);
  }
}
module.exports = Emites;
