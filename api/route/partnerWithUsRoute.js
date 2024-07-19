const router = require("express").Router();
const upload = require("../utils/imageUploader");
const { handleError } = require("../utils/handleError");
const { verifyTokenAndAdmin } = require("../utils/verifyToken");

const {
  deletePwus,
  getPwusDetails,
  putPwus,
  postPwus,
  getContactUsDetails,
  getPwus,
} = require("../controller/partnerWithUsController");

router.get("/", getPwus);

router.post(
  "/",
  upload.single("clientImages"),
  (err, req, res, next) => {
    if (err) {
      next(handleError(500, err.message));
      return;
    }
  },
  verifyTokenAndAdmin,
  postPwus
);

router.put(
  "/:id",
  upload.single("clientImages"),
  (err, req, res, next) => {
    if (err.code === "LIMIT_FILE_SIZE") {
      next(handleError(500, err.message));
      return;
    }
  },
  verifyTokenAndAdmin,
  putPwus
);
router.delete("/:id", deletePwus);
router.get("/:id", getPwusDetails);
router.get("/contactUs/details", getContactUsDetails);

module.exports = router;
