const axios = require("axios");

const getProduct = async (skuList) => {
  const productSkus = skuList;
  const productDetails = [];

  // make api request to get products
  const resProducts = await axios.get(
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

  // get the variants as well
  const resVariants = await axios.get(
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

  // add variants product first
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

  // add products if variation was not found
  resProducts.data.data.forEach((p) => {
    if (!productDetails.some((item) => item.sku === p.sku)) {
      productDetails.push({
        sku: p.sku,
        type: "product",
        product_id: p.id,
        variant_id: null,
        option_set_id: p.option_set_id,
      });
    }
  });

  // finalize and return product details
  return productDetails;
};

// export the function
module.exports = getProduct;
