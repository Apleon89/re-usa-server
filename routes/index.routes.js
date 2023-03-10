const isAuthenticated = require("../middlewares/auth.middlewares.js");

const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.use("/auth", require("./auth.routes.js"));

router.use("/perfil", isAuthenticated, require("./profile.routes.js"));

router.use("/anuncios", isAuthenticated, require("./ad.routes.js"));

router.use('/mensajes', isAuthenticated, require('./messages.routes.js'))

router.use("/upload", require('./upload.routes'));

module.exports = router;
