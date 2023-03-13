

const router = require("express").Router();
const uploader = require("../middlewares/cloudinary.config.js");


router.post("/", uploader.single("image"), (req, res, next) => {
  // console.log("file is: ", req.file);

  if (!req.file) {
    next("No file uploaded!");
    return;
  }

  res.json({ imageUrl: req.file.path });
});

module.exports = router;