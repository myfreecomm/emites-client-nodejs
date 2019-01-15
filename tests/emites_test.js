const fs = require('fs');
const assert = require('assert');
const nock = require('nock');
const Emites = require('../lib/emites');
const nfceParams = require('./support/nfce_batch_params_example.js');

describe('Emites', () => {
  const HOST = 'https://emites-sandbox.herokuapp.com';
  const organizationId = 11;
  const nfceId = 555;
  const invalidNFCeId = 666;
  let emites = null;

  describe('GET #getNFCe', () => {
    before(() => {
      emites = new Emites({ host: HOST, accessToken: 'foo' });
    });

    context('when it succeed', () => {
      const contents = fs.readFileSync('tests/support/nfce_mocked_response.json');
      const jsonContent = JSON.parse(contents);

      before(() => {
        nock(HOST)
          .get(`/api/v1/organizations/${organizationId}/nfce/${nfceId}`)
          .reply(200, jsonContent);
      });

      it('should return a NFCe json', async () => {
        const result = await emites.getNFCe(organizationId, nfceId);
        assert.equal(result.nfce.status, 'succeeded');
      });
    });

    context('when NFCe not found', () => {
      before(() => {
        nock(HOST)
          .get(`/api/v1/organizations/${organizationId}/nfce/${invalidNFCeId}`)
          .reply(404);
      });

      it('should respond with not found status (404)', async () => {
        const result = await emites.getNFCe(organizationId, invalidNFCeId);
        assert.equal(result, '');
      });
    });
  });

  describe('POST #createNFCeBatchNFCe', () => {
    context('when it succeed', () => {
      const contents = fs.readFileSync('tests/support/nfce_batch_created_mocked_response.json');
      const jsonContent = JSON.parse(contents);

      before(() => {
        nock(HOST)
          .post(`/api/v1/organizations/${organizationId}/nfce_batch`, nfceParams.NFCE_BATCH_PARAMS)
          .reply(201, jsonContent);
      });

      it('should create a NFCe and respond with its status', async () => {
        const result = await emites.createNFCeBatch(organizationId, nfceParams.NFCE_BATCH_PARAMS);
        assert.equal(result.nfce_batch.nfces[0].status, 'processing');
      });
    });

    context('when it fails (invalid serie)', () => {
      const params = nfceParams.NFCE_BATCH_PARAMS;
      params.nfce_batch.serie = '666';
      const contents = fs.readFileSync('tests/support/nfce_batch_create_fails_mocked_response.json');
      const jsonContent = JSON.parse(contents);

      before(() => {
        nock(HOST)
          .post(`/api/v1/organizations/${organizationId}/nfce_batch`, params)
          .reply(422, jsonContent);
      });

      it('should not create a NFCe and respond with error message', async () => {
        const result = await emites.createNFCeBatch(organizationId, params);
        assert.deepEqual(result, jsonContent);
      });
    });
  });
});
