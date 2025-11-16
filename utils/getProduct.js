const axios = require("axios");

const getProduct = async (skuList) => {
  const productDetails = [];

  // 1. Get products by SKU
  const resProducts = await axios.get(
    `${process.env.BG_STORE_URL}catalog/products?sku:in=${skuList.join(",")}`,
    {
      headers: {
        "X-Auth-Token": process.env.BG_TOKEN,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );

  // 2. Get variants by SKU
  const resVariants = await axios.get(
    `${process.env.BG_STORE_URL}catalog/variants?sku:in=${skuList.join(",")}`,
    {
      headers: {
        "X-Auth-Token": process.env.BG_TOKEN,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );

  // 3. Add variants first
  resVariants.data.data.forEach((v) => {
    if (!productDetails.some((item) => item.sku === v.sku)) {
      productDetails.push({
        sku: v.sku,
        type: "variant",
        product_id: v.product_id,
        variant_id: v.id,
        option_set_id: null,
      });
    }
  });

  // 4. Add products if no variant exists
  resProducts.data.data.forEach((p) => {
    if (!productDetails.some((item) => item.sku === p.sku)) {
      productDetails.push({
        sku: p.sku,
        type: "product",
        product_id: p.id,
        variant_id: null, // we will fetch default variant next
        option_set_id: p.option_set_id,
      });
    }
  });

  // 5. Fetch default variant for products that have modifiers but no variant
  for (const product of productDetails) {
    if (product.type === "product") {
      const resVariantsID = await axios.get(
        `${process.env.BG_STORE_URL}catalog/products/${product.product_id}/variants`,
        {
          headers: {
            "X-Auth-Token": process.env.BG_TOKEN,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      // If variants exist, assign the first variant ID as default
      if (resVariantsID.data.data.length > 0) {
        product.variant_id = resVariantsID.data.data[0].id;
      }
    }
  }

  return productDetails;
};

module.exports = getProduct;
