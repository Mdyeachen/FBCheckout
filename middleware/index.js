const notFoundHandler = require("./notFound");
const defaultErrorHandler = require("./defaltError");
const asyncWraper = require("./asyncWraper");

// export the middlewares
module.exports = {
  notFoundHandler,
  defaultErrorHandler,
  asyncWraper,
};
