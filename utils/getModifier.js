const axios = require("axios");

const getModifier = async (productIdList) => {
  const modifierList = [];

  for (const pid of productIdList) {
    // make api request to get modifiers
    const res = await axios.get(
      `${process.env.BG_STORE_URL}catalog/products/${pid}/modifiers`,
      {
        headers: {
          "X-Auth-Token": process.env.BG_TOKEN,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    const modifiers = res.data.data; // Array of modifiers

    // if no modifier return null
    if (!modifiers || modifiers.length === 0) {
      modifierList.push({
        product_id: pid,
        modifier_id: null,
        option_value_id: null,
      });
      continue; // proceed to next product id
    }

    const firstModifier = modifiers[0]; // my first modifier
    const firstValue = firstModifier.option_values[0]; // my first option_value

    modifierList.push({
      product_id: pid, // product id
      modifier_id: firstModifier.id, // modifier id
      option_value_id: firstValue.id, // first option value id
    });
  }

  return modifierList;
};

// export the function
module.exports = getModifier;
