const organizationPath = id => `/api/v1/organizations/${id}`;
const getNFCePath = (organizationId, id) => `${organizationPath(organizationId)}/nfce/${id}`;
const createNFCeBatchPath = organizationId => `${organizationPath(organizationId)}/nfce_batch`;
const cancellingNFCePath = (organizationId, id) => `${getNFCePath(organizationId, id)}/cancel`;

module.exports = { organizationPath, getNFCePath, createNFCeBatchPath, cancellingNFCePath };
