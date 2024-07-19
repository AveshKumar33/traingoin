const router = require("express").Router();
const { verifyTokenAndAdmin } = require("../utils/verifyToken");

const {
  addProductsToWishlist,
  addWishlist,
  getWishlist,
  getWishlistProduct,
  removeWishlistProduct,
  wishlistProductCount,
  getWishlistProductById,
  getAllSingleWishlistProductByUserId,
  getAllWishlistDotProductsByUserId,
  getAllWishlistCustomizedProductsByUserId,
  getWishlistCustomizedProductById,
  getAllCustomizeComboProductsByUserId,
  getAllCustomizeComboProductsByUserIdForWishlist,
  getSingleProductWishlistData,
  getDotProductWishlistData,
  getCustomizeProductWishlistData,
  getCustomizeComboProductWishlistData,
  getWishlistCustomizedProductsById,
  getWishlistSingleProductByWishlistId,
  getWishlistCustomizedComboProductById,
} = require("../controller/wishlistController");

/*Adding New Product to wishlist*/
router.post("/", verifyTokenAndAdmin, addWishlist);

// adding localstorage wishlist products
router.post("/all", verifyTokenAndAdmin, addProductsToWishlist);

router.get("/", verifyTokenAndAdmin, getWishlist);

// also getting all type of customized product for list favioute show && SIngle Product Wishlist data
router.post("/single-product/all/:userId", getAllSingleWishlistProductByUserId);

router.get(
  "/single-product-wishlist/all/:userId",
  getSingleProductWishlistData
);

router.post("/dot-product/all/:userId", getAllWishlistDotProductsByUserId);

router.get("/dot-product-wishlist/all/:userId", getDotProductWishlistData);

router.post(
  "/customized-product/all/:userId",
  getAllWishlistCustomizedProductsByUserId
);

router.get(
  "/customized-product-wishlist/all/:userId",
  getCustomizeProductWishlistData
);

router.get(
  "/customized-product-wishlist/:id",
  getWishlistCustomizedProductsById
);

router.get(
  "/customized-combo/all/:userId",
  getAllCustomizeComboProductsByUserId
);

router.post(
  "/customized-combo/wishlist-all/:userId",
  getAllCustomizeComboProductsByUserIdForWishlist
);

router.post(
  "/customized-combo/:id/:userId",
  getWishlistCustomizedComboProductById
);

router.get(
  "/customized-combo-wishlist/all/:userId",
  getCustomizeComboProductWishlistData
);

// get wishlist for product list
router.get("/for-list", verifyTokenAndAdmin, getWishlistProduct);

router.get("/product/:id", verifyTokenAndAdmin, getWishlistProductById);

router.get(
  "/single-product-wishlist/:id",
  getWishlistSingleProductByWishlistId
);

router.post("/product/:id/:userId", getWishlistCustomizedProductById);

router.get("/count", verifyTokenAndAdmin, wishlistProductCount);

router.delete("/:id", verifyTokenAndAdmin, removeWishlistProduct);

module.exports = router;
