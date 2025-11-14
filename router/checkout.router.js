const express = require("express");
const { checkoutHandler } = require("../controller/checkout.controller");

// create a router
const router = express.Router();

// Define checkout route
router.get("/", checkoutHandler);

module.exports = router;
