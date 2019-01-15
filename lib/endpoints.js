const organizationPath = id => `/api/v1/organizations/${id}`;
const getNFCePath = (organizationId, id) => `${organizationPath(organizationId)}/nfe/${id}`;
const createNFCeBatchPath = organizationId => `${organizationPath(organizationId)}/nfce_batch`;

module.exports = { organizationPath, getNFCePath, createNFCeBatchPath };
