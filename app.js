require("dotenv").config();
const express = require("express");
const checkoutRouter = require("./router/checkout.router");
const { notFoundHandler, defaultErrorHandler } = require("./middleware");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON requests
app.use(express.json());

// Sample route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Checkout route
app.use("/checkout", checkoutRouter);

// Not Found Middleware
app.use(notFoundHandler);
// Default Error Handler Middleware
app.use(defaultErrorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
