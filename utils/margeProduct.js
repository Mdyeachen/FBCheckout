const margeProduct = (products, modifiers, quantitys) => {
  return products.map((product) => {
    const productQuantity = quantitys.find((q) => q.sku === product.sku);
    const productModifiers = modifiers.find(
      (m) => m.product_id === product.product_id
    );
    return {
      ...product,
      modifier_id: productModifiers ? productModifiers.modifier_id : null,
      option_value_id: productModifiers
        ? productModifiers.option_value_id
        : null,
      quantity: productQuantity ? productQuantity.quantity : 1, // default to 1 if not found
    };
  });
};

// export the function
module.exports = margeProduct;
