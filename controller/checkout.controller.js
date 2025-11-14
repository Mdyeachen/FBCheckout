const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { asyncWraper } = require("../middleware");
const axios = require("axios");

const checkoutHandler = asyncWraper(async (req, res) => {
  const { products, coupon, cart_origin } = req.query;

  // Validate products parameter
  if (!products) {
    return res.status(400).json({
      success: false,
      error: "Products parameter is required",
    });
  }

  const productSkus = [];
  const productQuantities = [];

  // Parse products
  products.split(",").forEach((item) => {
    const [sku, quantity] = item.split(":");
    if (sku && quantity) {
      productSkus.push(sku);
      productQuantities.push(Number(quantity));
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
  const getResponse = await axios.get(
    `${process.env.BG_STORE_URL}catalog/products?sku:in=${productSkus.join(
      ","
    )}`,
    {
      headers: {
        "X-Auth-Token": process.env.BG_TOKEN,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );

  const productIds = [];

  getResponse.data.data.forEach((product) => {
    productIds.push(product.id);
  });

  const productLineItems = productIds.map((id, index) => ({
    productId: id,
    quantity: productQuantities[index],
  }));

  // POST to Storefront Carts
  const cartResponse = await axios.post(
    `${process.env.STOREFRONT_URL}/api/storefront/carts`,
    {
      lineItems: productLineItems,
      locale: "en",
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.STOREFRONT_ACCESS_TOKEN}`,
        "X-Auth-Client": process.env.STOREFRONT_CLIENT_ID,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );

  console.log("API Response:", productLineItems);
  console.log("Cart Id", cartResponse.data.id);

  res.send("Checkout Page");
});

module.exports = { checkoutHandler };
