const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { asyncWrapper } = require("../middleware");
const axios = require("axios");
const getProduct = require("../utils/getProduct");
const getModifier = require("../utils/getModifier");
const margeProduct = require("../utils/margeProduct");

const checkoutHandler = asyncWrapper(async (req, res) => {
  const { products, coupon, cart_origin } = req.query;
  const productSkus = [];
  const productQuantities = [];

  // Validate products parameter
  if (!products) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      status: ReasonPhrases.BAD_REQUEST,
      error: "Products parameter is required",
    });
  }

  // Parse products with trim
  products.split(",").forEach((item) => {
    const [skuRaw, quantityRaw] = item.split(":");
    const sku = skuRaw?.trim();
    const quantity = quantityRaw?.trim();
    if (sku && quantity) {
      productSkus.push(sku);
      productQuantities.push({ sku, quantity: Number(quantity) });
    }
  });

  // Validate we have products to process
  if (productSkus.length === 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: ReasonPhrases.BAD_REQUEST,
      statusCode: StatusCodes.BAD_REQUEST,
      message: "No valid products found in the products parameters",
    });
  }

  // Make API request to get product details
  const productDetails = await getProduct(productSkus);

  // Get modifier options if any
  const productIdList = productDetails.map((item) => item.product_id);

  // Fetch all modifiers for all products
  const modifierRes = await getModifier(productIdList);

  // const marge product detials, quantity and modifier
  const productInfo = margeProduct(
    productDetails,
    modifierRes,
    productQuantities
  );

  console.log(productInfo);

  res.send("Checkout Page");
});

module.exports = { checkoutHandler };
