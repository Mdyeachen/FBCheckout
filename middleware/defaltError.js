const { StatusCodes, ReasonPhrases } = require("http-status-codes");

// default Error Handler Middleware
const defaultErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || ReasonPhrases.INTERNAL_SERVER_ERROR;
  const errors = err.errors || [];

  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
    errors,
  });
};

module.exports = defaultErrorHandler;
