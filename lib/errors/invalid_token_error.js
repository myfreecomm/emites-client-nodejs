module.exports = class InvalidTokenError extends Error {
  constructor(message) {
    super(message);

    Error.captureStackTrace(this, this.constructor);

    this.name = 'InvalidTokenError';
  }
};
