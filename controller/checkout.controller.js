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
      productQuantities.push({ sku: Number(quantity) });
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
  const productRes = await axios.get(
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

  // Make API request to get product details
  const variantRes = await axios.get(
    `${process.env.BG_STORE_URL}catalog/variants?sku:in=${productSkus.join(
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

  // Get full product details for line items
  let productDetials = [];

  // Add variants
  variantRes.data.data.forEach((v) => {
    if (!productDetials.some((item) => item.sku === v.sku)) {
      productDetials.push({
        sku: v.sku,
        type: "variant",
        product_id: v.product_id,
        variant_id: v.id,
        option_set_id: null,
      });
    }
  });

  // add products
  productRes.data.data.forEach((p) => {
    if (!productDetials.some((item) => item.sku === p.sku)) {
      productDetials.push({
        sku: p.sku,
        type: "product",
        product_id: p.id,
        variant_id: null,
        option_set_id: p.option_set_id,
      });
    }
  });

  // getResponse.data.data.forEach((product) => {
  //   productIds.push(product.id);
  // });

  // const productLineItems = productIds.map((id, index) => ({
  //   productId: id,
  //   quantity: productQuantities[index],
  // }));

  // // POST to Storefront Carts
  // const cartResponse = await axios.post(
  //   `${process.env.STOREFRONT_URL}/api/storefront/carts`,
  //   {
  //     lineItems: productLineItems,
  //     locale: "en",
  //   },
  //   {
  //     headers: {
  //       Authorization: `Bearer ${process.env.STOREFRONT_ACCESS_TOKEN}`,
  //       "X-Auth-Client": process.env.STOREFRONT_CLIENT_ID,
  //       "Content-Type": "application/json",
  //       Accept: "application/json",
  //     },
  //   }
  // );

  console.log(productDetials);
  console.log(productQuantities);
  // console.log("Cart Id", cartResponse.data.id);

  res.send("Checkout Page");
});

module.exports = { checkoutHandler };
