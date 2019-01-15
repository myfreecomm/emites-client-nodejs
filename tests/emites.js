const assert = require('assert');
const nock = require('nock');
const Emites = require('../lib/emites');
const fs = require('fs');

describe('Emites', () => {
  const HOST = 'https://emites-sandbox.herokuapp.com';
  const organizationId = 11;
  const nfceId = 555;
  let emites = null;

  describe('GET #getNFCe', () => {
    context('when it succeed', () => {
      before(() => {
        emites = new Emites({ host: HOST, accessToken: 'foo' });

        const contents = fs.readFileSync('tests/nfce_mocked_response.json');
        const jsonContent = JSON.parse(contents);

        nock(HOST)
          .get(`/api/v1/organizations/${organizationId}/nfe/${nfceId}`)
          .reply(200, jsonContent);
      });

      it('should respond with 200 status', async () => {
        const result = await emites.getNFCe(organizationId, nfceId);
        assert.equal(result.status, 200);
        assert.equal(result.data.nfce.status, 'succeeded');
      });
    });
  });
});
