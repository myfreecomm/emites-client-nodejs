# emites-client-nodejs
Emites REST API Client for NodeJS

## Usage
```
const Emites = require('emites-client-nodejs');

const emitesClient = new Emites({ host: 'https://app.emites.com.br', access_token: '...'});

//
//  Get a NFC-e from a certain organization by ID
//
emitesClient.nfce({{organizationID}}, {{nfceId}});

//
//  Create NFC-e Batch
//
emitesClient.createNFCeBatch({{organizationID}}, {{objectParams}});
```
## For further information

[Access our REST API docs](https://myfreecomm.github.io/emites-api-docs)
