const logger = require('./logger');
const HTTP_STATUS_CODE = require('../enums/http-status-code');
const API_ERRORS = require('../enums/api-errors');

/**
 * Handles the unexpected API errors
 */
function apiErrorHandler(err, req, res, next) {
    let errorObject, statusCode = null;

    logger('express-middleware').error(err.stack);

    if (err.status === HTTP_STATUS_CODE.CLIENT_ERROR.NOT_FOUND) {
        statusCode = HTTP_STATUS_CODE.CLIENT_ERROR.NOT_FOUND;

        errorObject = API_ERRORS.RESOURCE_NOT_FOUND;
    } else {
        statusCode = HTTP_STATUS_CODE.SERVER_ERROR.INTERNAL_SERVER_ERROR;

        errorObject = API_ERRORS.UNEXPECTED_ERROR;
    }

    // If the current LIST web server was started as development mode (--dev) it will be
    // included the error stack in the error response.
    if (process.env.DEV_MODE) {
        errorObject = {
            ...errorObject,
            stack: err.stack
        };
    }

    res.status(statusCode).send(errorObject);
}

/**
 * Handles the Resource Not Found errors
 */
function resourceNotFoundHandler (req, res, next) {
    const err = new Error('Not Found');
    err.status = HTTP_STATUS_CODE.CLIENT_ERROR.NOT_FOUND;

    logger('express-middleware').error(`Resource not found. Request: ${req.originalUrl}`);

    next(err);
}

module.exports = {
    apiErrorHandler,
    resourceNotFoundHandler
};