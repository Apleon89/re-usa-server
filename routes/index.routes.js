const isAuthenticated = require("../middlewares/auth.middlewares.js");

const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.use("/auth", require("./auth.routes.js"));

router.use("/perfil", isAuthenticated, require("./profile.routes.js"));

module.exports = router;
