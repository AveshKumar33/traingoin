const router = require("express").Router();
// const { verifyTokenAndAdmin } = require("../utils/verifyToken");

const { generatePDF } = require("../pdf/test");
const { generateQuotationPDF } = require("../pdf/quotation");

router.get("/quotation/:productType/:id", generateQuotationPDF);

router.get("/test/:productType/:id", generatePDF);

module.exports = router;
