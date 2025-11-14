const { StatusCodes, ReasonPhrases } = require("http-status-codes");

// Not Found Middleware
const notFoundHandler = (req, res, next) => {
  const statusCode = StatusCodes.NOT_FOUND;
  const message = ReasonPhrases.NOT_FOUND;

  res.status(statusCode).json({
    status: "Not Found",
    statusCode,
    message,
  });
};

// export the middleware
module.exports = notFoundHandler;
