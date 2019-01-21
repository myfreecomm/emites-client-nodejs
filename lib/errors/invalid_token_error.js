const CustomError = require('./custom_error');

module.exports = class InvalidTokenError extends CustomError {
  constructor(message) {
    super(message);
    this.name = 'InvalidTokenError';
  }
};
