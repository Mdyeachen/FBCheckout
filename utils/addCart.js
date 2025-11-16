const axios = require("axios");

const addCart = async (products) => {
  if (!Array.isArray(products) || products.length === 0) {
    throw new Error("Products array is required and cannot be empty.");
  }

  // make the products line items
  const lineItems = products.map((item) => {
    const lineItem = {
      quantity: item.quantity,
      productId: item.product_id,
    };

    // Add variantId if exists
    if (item.variant_id) {
      lineItem.variantId = item.variant_id;
    }

    // Add optionSelections if modifier & option_value exist
    if (item.modifier_id && item.option_value_id) {
      lineItem.optionSelections = [
        {
          optionId: item.modifier_id,
          optionValue: item.option_value_id,
        },
      ];
    }

    return lineItem;
  });

  // create the options
  const options = {
    method: "POST",
    url: `${process.env.STOREFRONT_URL}/api/storefront/carts`,
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    data: {
      lineItems,
      locale: "en",
    },
  };

  // api request for create cart
  return await axios.request(options);
};

// export the functions
module.exports = addCart;
