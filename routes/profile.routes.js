const UserModel = require("../models/User.model");
const AdModel = require("../models/Ad.model");
const router = require("express").Router();

router.get("/:idUsuario", async (req, res, next) => {
  const { idUsuario } = req.params;
  try {
    const response = await UserModel.findById(idUsuario);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

router.patch("/:idUsuario/editar", async (req, res, next) => {
  const { idUsuario } = req.params;
  const { username, location, profileImage } = req.body;
  try {
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
  } catch (error) {}
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

router.delete('/:idUsuario/delete', async (req, res, next) => {
    const { idUsuario } = req.params;
    try {
        await UserModel.findByIdAndDelete(idUsuario)
        res.json('Usuario Eliminado')
    } catch (error) {
        next(error)
    }
})

module.exports = router;
