const fs = require('fs');
const assert = require('assert');
const nock = require('nock');
const Emites = require('../lib/emites');
const nfceParams = require('./support/nfce_batch_params_example.js');

describe('Emites', () => {
  const HOST = 'https://emites-sandbox.herokuapp.com';
  const organizationId = 11;
  const nfceId = 555;
  let emites = null;

  describe('GET #getNFCe', () => {
    context('when it succeed', () => {
      before(() => {
        emites = new Emites({ host: HOST, accessToken: 'foo' });

        const contents = fs.readFileSync('tests/support/nfce_mocked_response.json');
        const jsonContent = JSON.parse(contents);

        nock(HOST)
          .get(`/api/v1/organizations/${organizationId}/nfe/${nfceId}`)
          .reply(200, jsonContent);
      });

      it('should respond with success status', async () => {
        const result = await emites.getNFCe(organizationId, nfceId);
        assert.equal(result.status, 200);
        assert.equal(result.data.nfce.status, 'succeeded');
      });
    });
  });

  describe('POST #createNFCeBatchNFCe', () => {
    context('when it succeed', () => {
      before(() => {
        emites = new Emites({ host: HOST, accessToken: 'foo' });

        const contents = fs.readFileSync('tests/support/nfce_batch_created_mocked_response.json');
        const jsonContent = JSON.parse(contents);

        nock(HOST)
          .post(`/api/v1/organizations/${organizationId}/nfce_batch`, nfceParams.NFCE_BATCH_PARAMS)
          .reply(201, jsonContent);
      });

      it('should respond with created status', async () => {
        const result = await emites.createNFCeBatch(organizationId, nfceParams.NFCE_BATCH_PARAMS);
        assert.equal(result.status, 201);
        assert.equal(result.data.nfce_batch.nfces[0].status, 'processing');
      });
    });
  });
});