const router = require("express").Router();
const AdModel = require("../models/Ad.model");
const UserModel = require("../models/User.model");
const isAuthenticated = require("../middlewares/auth.middlewares.js");

// Añadir Anuncio
router.post("/anadir", isAuthenticated, async (req, res, next) => {
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
    const response = await AdModel.find()
      .populate("owner", "username")
      .select("owner title adImages updatedAt category description");
    const ordenedArr = response.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    res.json(ordenedArr);
  } catch (error) {
    next(error);
  }
});

// Anuncios favoritos del usuario
router.get("/favoritos", isAuthenticated, async (req, res, next) => {
  const activeUSerId = req.payload._id;
  try {
    const response = await UserModel.findById(activeUSerId)
      .select("favouritesAds")
      .populate("favouritesAds");
    const ordenedArr = response.favouritesAds.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    res.json(ordenedArr);
  } catch (error) {
    next(error);
  }
});

// Editar anuncios
router.patch("/:idProducto/editar", isAuthenticated, async (req, res, next) => {
  const { idProducto } = req.params;
  const { title, description, category, image1, image2, image3, image4 } =
    req.body;

  try {
    await AdModel.findByIdAndUpdate(
      idProducto,
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
    res.json("anuncio modificado");
    console.log("anuncio modificado");
  } catch (error) {
    next(error);
  }
});

// Detalles de un anuncio
router.get("/:idProducto", isAuthenticated, async (req, res, next) => {
  const { idProducto } = req.params;
  try {
    const user = await UserModel.findById(req.payload).select("favouritesAds");
    const response = await AdModel.findById(idProducto).populate(
      "owner",
      "location username"
    );
    res.json([response, user]);
  } catch (error) {
    next(error);
    console.log(error);
  }
});

// Eliminar anuncio
router.delete(
  "/:idProducto/eliminar",
  isAuthenticated,
  async (req, res, next) => {
    const { idProducto } = req.params;

    try {
      await AdModel.findByIdAndDelete(idProducto);
      res.json();
    } catch (error) {
      next(error);
    }
  }
);
// Añadir/Eliminar favorito un anuncio
router.patch(
  "/:idProducto/favorito",
  isAuthenticated,
  async (req, res, next) => {
    const { favAd, delFavAd } = req.body;
    const activeUSerId = req.payload._id;
    try {
      if (favAd) {
        await UserModel.findByIdAndUpdate(activeUSerId, {
          $push: { favouritesAds: favAd },
        });
        res.json("favorito añadido");
      }
      if (delFavAd) {
        await UserModel.findByIdAndUpdate(activeUSerId, {
          $pull: { favouritesAds: delFavAd },
        });
        res.json("favorito eliminado");
      }
    } catch (error) {
      next(error);
      console.log(error);
    }
  }
);

module.exports = router;
