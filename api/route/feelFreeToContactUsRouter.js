const {
  getallFeelFreeToContactUs,
  createFeelFreeToContactUs,
} = require("../controller/feelFreeToContactUsController");
const router = require("express").Router();
router.get("/", getallFeelFreeToContactUs);
router.post("/", createFeelFreeToContactUs);

module.exports = router;
