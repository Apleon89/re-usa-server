const AdModel = require("../models/Ad.model");
const UserModel = require("../models/User.model");

const router = require("express").Router();

// Añadir Anuncio
router.post("/anadir", async (req, res, next) => {
  const {
    owner,
    title,
    description,
    category,
    image1,
    image2,
    image3,
    image4,
  } = req.body;

  try {
    const response = await AdModel.create({
      owner,
      title,
      description,
      category,
      adImages: [image1, image2, image3, image4],
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Listar anuncios
router.get("/", async (req, res, next) => {
  try {
    const response = await AdModel.find();
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Anuncios favoritos del usuario
router.get("/favoritos", async (req, res, next) => {
  const activeUSerId = req.payload._id;
  try {
    const response = await UserModel.findById(activeUSerId).populate(
      "favouritesAds"
    );
    res.json(response.favouritesAds);
  } catch (error) {
    next(error);
  }
});

// Editar anuncios
router.patch("/:idProducto/editar", async (req, res, next) => {
  const { idProduct } = req.params;
  const { title, description, category, image1, image2, image3, image4 } =
    req.body;

  try {
    const response = await AdModel.findByIdAndUpdate(
      idProduct,
      {
        title,
        description,
        category,
        adImages: [image1, image2, image3, image4],
      },
      {
        new: true,
      }
    );
    res.json(response);
    console.log("anuncio modificado");
  } catch (error) {
    next(error);
  }
});

// Detalles de un anuncio
router.get("/:idProducto", async (req, res, next) => {
  const { idProducto } = req.params;
  try {
    const response = await AdModel.findById(idProducto);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Añadir/Eliminar favorito un anuncio
router.post("/:idProducto/favorito", async (req, res, next) => {

  const { favAd, delFavAd } = req.body;
  const { idProducto } = req.params;
  const activeUSerId = req.payload._id;
  try {
    if (favAd) {
        await UserModel.findByIdAndUpdate(activeUSerId, {
            $push: {favouritesAds: favAd}
        })
        res.json('favorito añadido')
    }
    if (delFavAd) {
        await UserModel.findByIdAndUpdate(activeUSerId, {
            $pull: { favouritesAds: delFavAd}
        })
        res.json('favorito eliminado')
    }
  } catch (error) {}
});

module.exports = router;
