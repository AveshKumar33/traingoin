const upload = require("../utils/imageUploader");
const {
  getarchitech,
  architectlogin,
  postarchitech,
  putarchitech,
  deletearchitech,
  getarchitechdetails,
  removeProduct,
  logoutArchitect,
  verifyArchitect,
  getArchitechByURL,
  changePassword,
} = require("../controller/architechController");

const { verifyTokenBackend, verifyToken } = require("../utils/verifyToken");
const { handleError } = require("../utils/handleError");

const router = require("express").Router();

router.get("/", getarchitech);

router.post(
  "/",
  verifyToken,
  upload.single("architect"),
  (err, req, res, next) => {
    if (err) {
      next(handleError(500, err.message));
      return;
    }
  },

  postarchitech
);

router.put("/change-password", changePassword);

router.put(
  "/:id",
  verifyToken,
  upload.single("architect"),
  (err, req, res, next) => {
    if (err.code === "LIMIT_FILE_SIZE") {
      next(handleError(500, err.message));
      return;
    }
  },
  putarchitech
);
router.put("/product/:productID", verifyToken, removeProduct);
router.delete("/:id", deletearchitech);
router.get("/:id", getarchitechdetails);

router.post("/login", architectlogin);
router.post("/logout", logoutArchitect);

router.post("/verifyToken", verifyTokenBackend, verifyArchitect);

module.exports = router;
