const CustomError = require('./custom_error');

module.exports = class ResourceNotFoundError extends CustomError {
  constructor(message) {
    super(message);
    this.name = 'ResourceNotFoundError';
  }
};
