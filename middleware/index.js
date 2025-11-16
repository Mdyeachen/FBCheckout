const notFoundHandler = require("./notFound");
const defaultErrorHandler = require("./defaltError");
const asyncWrapper = require("./asyncWrapper");

// export the middlewares
module.exports = {
  notFoundHandler,
  defaultErrorHandler,
  asyncWrapper,
};
