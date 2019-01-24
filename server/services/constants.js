exports.errorName = {
  INVALID_EMAIL: 'INVALID_EMAIL',
  ALREADY_USED_EMAIL: 'ALREADY_USED_EMAIL',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  NOT_AUTHORIZED: 'NOT_AUTHORIZED',
  NOT_REGISTERED_EMAIL: 'NOT_REGISTERED_EMAIL',
  INVALID_PASSWORD: 'INVALID_PASSWORD',
  BAD_REQUEST: 'BAD_REQUEST'
};

exports.errorType = {
  INVALID_EMAIL: {
    message: 'Email is invalid',
    statusCode: 400
  },
  ALREADY_USED_EMAIL: {
    message: 'Email is already used',
    statusCode: 400
  },
  UNKNOWN_ERROR: {
    message: 'Oops. Something went wrong. Please refresh page and try again',
    statusCode: 500
  },
  NOT_AUTHORIZED: {
    message: 'Access denied. Please authorize',
    statusCode: 401
  },
  NOT_REGISTERED_EMAIL: {
    message: 'No user with that email',
    statusCode: 400
  },
  INVALID_PASSWORD: {
    message: 'Invalid password',
    statusCode: 400
  },
  BAD_REQUEST: {
    message: 'Wrong request params',
    statusCode: 400
  },
};
