const {
  getallService,
  postservice,
  putservice,
  deleteservice,
  servicedetails,
  getallProductByUserId,
  getallProductByArchitectId,
  architectCountById,
  singleProductByRfpid,
  singleProductByRfpidForQuotation,
} = require("../controller/raiseAQueryController");
const { verifyTokenAndAdmin } = require("../utils/verifyToken");
const router = require("express").Router();

router.get("/", getallService);
router.get("/single-product/combination/:id", singleProductByRfpid);
router.get(
  "/single-product/combination-for-quotation/:id",
  singleProductByRfpidForQuotation
);
router.get("/product", getallProductByUserId);
router.get("/architect", verifyTokenAndAdmin, getallProductByArchitectId);
router.post("/", postservice);
router.put("/:id", putservice);
router.delete("/:id", deleteservice);
router.get("/count/:id", architectCountById);
router.get("/combination/:id", servicedetails);

module.exports = router;
