const {
  deletecoupons,
  getcouponsdetails,
  putcoupons,
  postcoupons,
  getcoupons,
  getAvailableCoupons,
} = require("../controller/couponController");
const { verifyTokenAndAdmin } = require("../utils/verifyToken");
const router = require("express").Router();

router.get("/", getcoupons);
router.get("/available-coupons", getAvailableCoupons);
router.post("/", verifyTokenAndAdmin, postcoupons);
router.delete("/:id", verifyTokenAndAdmin, deletecoupons);
router.put("/:id", verifyTokenAndAdmin, putcoupons);
router.get("/:id", getcouponsdetails);

module.exports = router;
