const router = require("express").Router();
const {
  deleteExibhitions,
  getExibhitionsDetails,
  putExibhitions,
  postExibhitions,
  getAllExibhitions,
  deleteImage,
} = require("../controller/exibhitionsController");
const upload = require("../utils/imageUploader");
const { verifyTokenAndAdmin } = require("../utils/verifyToken");
const { handleError } = require("../utils/handleError");

router.get("/", getAllExibhitions);
router.get("/:id", getExibhitionsDetails);
router.post(
  "/",
  verifyTokenAndAdmin,
  upload.array("exibhitionsimg", 10),
  (err, req, res, next) => {
    if (err.code === "LIMIT_FILE_SIZE") {
      next(handleError(500, err.message));
      return;
    }
  },
  postExibhitions
);
router.delete("/:id", verifyTokenAndAdmin, deleteExibhitions);
router.put("/:id/:name", deleteImage);
router.put(
  "/:id",
  verifyTokenAndAdmin,
  upload.array("exibhitionsimg", 10),
  (err, req, res, next) => {
    if (err.code === "LIMIT_FILE_SIZE") {
      next(handleError(500, err.message));
      return;
    }
  },
  putExibhitions
);

module.exports = router;
