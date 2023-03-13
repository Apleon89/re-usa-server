const UserModel = require("../models/User.model");
const AdModel = require("../models/Ad.model");
const router = require("express").Router();

router.get("/:idUsuario", async (req, res, next) => {
  const { idUsuario } = req.params;
  try {
    const response = await UserModel.findById(idUsuario).select(
      "profileImage username email location"
    );
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

router.patch("/:idUsuario/editar", async (req, res, next) => {
  const { idUsuario } = req.params;
  const { username, location, profileImage } = req.body;
  try {
    const usernameFound = await UserModel.findOne({ username: username });
    console.log(usernameFound);
    if (usernameFound && usernameFound._id != idUsuario) {
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
    res.status(202).json(response);
  } catch (error) {
    next(error);
  }
});

router.get("/:idUsuario/misAnuncios", async (req, res, next) => {
  const { idUsuario } = req.params;
  try {
    const response = await AdModel.find({ owner: idUsuario });
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

router.patch("/:idUsuario/delete", async (req, res, next) => {
  const { idUsuario } = req.params;
  try {
    await UserModel.findByIdAndUpdate(idUsuario, {
      username: `Usuario Eliminado ${idUsuario}`,
      email: `${idUsuario}@usuario.com`,
      location: "",
      profileImage:
        "https://res.cloudinary.com/dacltsvln/image/upload/v1678703493/re-Usa/ycvqs2xrodjsdigteaew.png",
    });
    const deletedUserAds = await AdModel.find({ owner: idUsuario });
    console.log(deletedUserAds);
    deletedUserAds.forEach(async (each) => {
      try {
        await AdModel.findByIdAndDelete(each._id);
      } catch (error) {
        console.log(error);
      }
    });
    res.status(200).json("Usuario Eliminado");
  } catch (error) {
    next(error);
    console.log(error);
  }
});

module.exports = router;
