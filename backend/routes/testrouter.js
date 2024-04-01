const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadmulter");
const { uploadFiles, generatePdf, getFiles } = require("../controller/controller");
const { createUser, LoginUser, getNameWithToken } = require("../controller/authentication");

router.post("/upload-files", upload.single("file"), uploadFiles);
router.post("/generate-pdf", generatePdf);
router.get("/get-files", getFiles);

/* Authentication */

router.route('/signup').post(createUser);
router.route('/login').post(LoginUser);
router.route('/getname').get(getNameWithToken);

module.exports = router;
