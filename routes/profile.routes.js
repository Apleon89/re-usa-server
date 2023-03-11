const UserModel = require("../models/User.model");
const AdModel = require("../models/Ad.model");
const router = require("express").Router();

router.get("/:idUsuario", async (req, res, next) => {
  const { idUsuario } = req.params;
  try {
    const response = await UserModel.findById(idUsuario).select(
      "profileImage username email location"
    );
    res.json(response);
  } catch (error) {
    next(error);
  }
});

router.patch("/:idUsuario/editar", async (req, res, next) => {
  const { idUsuario } = req.params;
  const { username, location, profileImage } = req.body;
  try {
    const usernameFound = await UserModel.findOne({ username: username });
    if (usernameFound) {
      return res
        .status(400)
        .json({ errorMessage: "Nombre de Usuario registrado" });
    }

    const response = await UserModel.findByIdAndUpdate(
      idUsuario,
      {
        username,
        location,
        profileImage,
      },
      {
        new: true,
      }
    );
    console.log(response);
    res.json(response);
  } catch (error) {
    next(error)
  }
});

router.get("/:idUsuario/misAnuncios", async (req, res, next) => {
  const { idUsuario } = req.params;
  try {
    const response = await AdModel.find({ owner: idUsuario });
    res.json(response);
  } catch (error) {
    next(error);
  }
});

router.delete("/:idUsuario/delete", async (req, res, next) => {
  const { idUsuario } = req.params;
  try {
    await UserModel.findByIdAndDelete(idUsuario);
    res.json("Usuario Eliminado");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
