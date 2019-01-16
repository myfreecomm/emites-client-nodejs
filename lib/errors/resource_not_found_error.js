module.exports = class ResourceNotFoundError extends Error {
  constructor(message) {
    super(message);

    Error.captureStackTrace(this, this.constructor);

    this.name = 'ResourceNotFoundError';
  }
};
