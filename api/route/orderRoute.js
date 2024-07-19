const {
  deleteorders,
  getorderdetails,
  putorders,
  postorders,
  getorders,
  paytmCallback,
  updateOrderItem,
  InstallmentPayment,
  getAllOrdersByUserId,
  getOrderedProduct,
  getOrderProductByOrderItemId,
} = require("../controller/orderController");
const { verifyTokenAndAdmin } = require("../utils/verifyToken");
const router = require("express").Router();

router.get("/", verifyTokenAndAdmin, getorders);
router.get("/:id", verifyTokenAndAdmin, getOrderedProduct);
router.get(
  "/product/:productType/:orderId/:orderItemId",
  verifyTokenAndAdmin,
  getOrderProductByOrderItemId
);
router.post("/", verifyTokenAndAdmin, postorders);
router.delete("/:id", deleteorders);
router.put("/:id/:orderItemId", verifyTokenAndAdmin, putorders);
router.get("/:id", getorderdetails);
router.get("/user/id", verifyTokenAndAdmin, getAllOrdersByUserId);
router.post("/paytm/callback", paytmCallback);
router.put("/orderitem/:id", updateOrderItem);
router.put("/installmentpayment/:id", InstallmentPayment);

module.exports = router;
