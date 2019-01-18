# emites-client-nodejs
Emites REST API Client for NodeJS

## Installing
`npm i @nexaas/emites-client`

## Usage
```javascript
const Emites = require('@nexaas/emites-client');

const emitesClient = new Emites({ host: 'https://app.emites.com.br', access_token: '...'});

/**
*  Get a NFC-e from a certain organization by ID
*/
emitesClient.nfce({{organizationID}}, {{nfceId}});

/**
*  Create NFC-e Batch
*/
emitesClient.createNFCeBatch({{organizationID}}, {{objectParams}});
```
## For further information

[Access our REST API docs](https://myfreecomm.github.io/emites-api-docs)
