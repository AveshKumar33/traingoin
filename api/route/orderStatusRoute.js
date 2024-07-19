const {
  deleteOrderStatus,
  getOrderStatusDetails,
  putOrderStatus,
  postOrderStatus,
  getOrderStatus,
} = require("../controller/orderStatusController");
const { verifyTokenAndAdmin } = require("../utils/verifyToken");
const router = require("express").Router();

router.get("/", getOrderStatus);
router.post("/", verifyTokenAndAdmin, postOrderStatus);
router.delete("/:id", verifyTokenAndAdmin, deleteOrderStatus);
router.put("/:id", verifyTokenAndAdmin, putOrderStatus);
router.get("/:id", getOrderStatusDetails);

module.exports = router;
