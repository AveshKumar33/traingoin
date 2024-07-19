const router = require("express").Router();
const { verifyTokenAndAdmin } = require("../utils/verifyToken");

const {
  addToCart,
  addProductsToCart,
  getCartSingleProduct,
  getCartCustomizeProduct,
  getCartSingleDotProduct,
  getCartCustomizeDotProduct,
  getCartCustomizeComboProduct,
  getAllCartSingleProductForCart,
  getAllCartCustomizedProductsForCart,
  getAllCartDotProductsForCart,
  getAllCustomizeComboForCart,
  updateCartProductQuantity,
  deleteCartProduct,
  cartProductMoveToWishlist,
  getCartProductById,
  getCartCustomixedProductCombinationById,
  userCartEmpty,
} = require("../controller/cartController");

/*Adding local storage Product to cart*/
router.post("/", verifyTokenAndAdmin, addToCart);

// adding localstorage cart products
router.post("/all", verifyTokenAndAdmin, addProductsToCart);

// get cart products
router.get(
  "/single-product/:userId/:productId",
  verifyTokenAndAdmin,
  getCartSingleProduct
);

// get cart products
router.get(
  "/customize-product/:userId/:productId",
  verifyTokenAndAdmin,
  getCartCustomizeProduct
);

// get cart products
router.get(
  "/single-dot-product/:userId/:productId",
  verifyTokenAndAdmin,
  getCartSingleDotProduct
);

// get cart products
router.get(
  "/customize-dot-product/:userId/:productId",
  verifyTokenAndAdmin,
  getCartCustomizeDotProduct
);

// get cart products
router.get(
  "/customize-combo-product/:userId/:productId",
  verifyTokenAndAdmin,
  getCartCustomizeComboProduct
);

// get cart products for show in cart
router.post("/product/single-product/:userId", getAllCartSingleProductForCart);

router.post(
  "/product/customized-product/:userId",
  getAllCartCustomizedProductsForCart
);

router.post("/product/dot-product/:userId", getAllCartDotProductsForCart);

router.post("/product/customized-combo/:userId", getAllCustomizeComboForCart);

// update quantity
router.put("/:id", updateCartProductQuantity);
router.get("/get-cart-item/:id", getCartProductById);
router.get(
  "/get-cart-customize-combination/:id",
  getCartCustomixedProductCombinationById
);

router.delete("/:id", deleteCartProduct);
router.delete("/products/:userId", userCartEmpty);

// move cart product to wishlist
router.get("/move/:id", cartProductMoveToWishlist);

module.exports = router;
