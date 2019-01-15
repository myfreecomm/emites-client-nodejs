const organizationPath = id => `/api/v1/organizations/${id}`;
const getNFCePath = (organizationId, id) => `${organizationPath(organizationId)}/nfe/${id}`;

module.exports = { organizationPath, getNFCePath };
