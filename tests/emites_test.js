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

  /* eslint-disable no-new */
  describe('Validating config', () => {
    context('without config object', () => {
      const error = { name: 'TypeError', message: 'config must be object, got undefined' };

      it('should throw an type error', () => {
        assert.throws(() => { new Emites(); }, error);
      });
    });
    context('without access_token', () => {
      const error = { name: 'Error', message: 'Emites config must include `access_token`.' };

      it('should throw an error', () => {
        assert.throws(() => { new Emites({ host: HOST }); }, error);
      });
    });
  });

  describe('GET #nfce', () => {
    before(() => {
      emites = new Emites({ host: HOST, access_token: 'foo' });
    });

    context('without parameters', () => {
      const error = { name: 'TypeError', message: 'Function args must have organizationId and id' };

      it('should throw a type error', () => {
        assert.rejects(async () => { await emites.nfce(); }, error);
      });
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
        const result = await emites.nfce(organizationId, nfceId);
        assert.equal(result.nfce.status, 'succeeded');
      });
    });

    context('when NFCe not found', () => {
      const error = { name: 'ResourceNotFoundError', message: 'Resource Not Found' };

      before(() => {
        nock(HOST)
          .get(`/api/v1/organizations/${organizationId}/nfce/${invalidNFCeId}`)
          .reply(404);
      });

      it('should respond with not found status (404)', () => {
        assert.rejects(async () => { await emites.nfce(organizationId, invalidNFCeId); }, error);
      });
    });

    context('when communicating with Emites fails', () => {
      const error = { name: 'Error', message: 'Communicating with Emites failed' };

      before(() => {
        nock(HOST)
          .get(`/api/v1/organizations/${organizationId}/nfce/${invalidNFCeId}`);
      });

      it('should throw a requesting error', () => {
        assert.rejects(async () => { await emites.nfce(organizationId, invalidNFCeId); }, error);
      });
    });

    context('with invalid token', () => {
      const error = { name: 'InvalidTokenError', message: 'Invalid Access Token' };

      before(() => {
        nock(HOST)
          .get(`/api/v1/organizations/${organizationId}/nfce/${invalidNFCeId}`)
          .reply(401);
      });

      it('should throw a invalid token error', () => {
        assert.rejects(async () => { await emites.nfce(organizationId, invalidNFCeId); }, error);
      });
    });

    context('with unexpected status code', () => {
      const error = { name: 'Error', message: 'Unexpected status code received: 500' };

      before(() => {
        nock(HOST)
          .get(`/api/v1/organizations/${organizationId}/nfce/${invalidNFCeId}`)
          .reply(500);
      });

      it('should throw a invalid token error', () => {
        assert.rejects(async () => { await emites.nfce(organizationId, invalidNFCeId); }, error);
      });
    });
  });

  describe('POST #createNFCeBatchNFCe', () => {
    before(() => {
      emites = new Emites({ host: HOST, access_token: 'foo' });
    });

    context('without parameters', () => {
      const error = { name: 'TypeError', message: 'Function args must have organizationId and params' };

      it('should throw a type error', () => {
        assert.rejects(async () => { await emites.createNFCeBatch(); }, error);
      });
    });

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
