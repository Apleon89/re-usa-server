const router = require("express").Router();
const UserModel = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const isAuthenticated = require("../middlewares/auth.middlewares");

router.post("/registro", async (req, res, next) => {
  const { email, password, repeatPassword, username } = req.body;
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
  const emailRegex =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

  if (!email || !password || !repeatPassword || !username) {
    return res
      .status(400)
      .json({ errorMessage: "Los campos deben estar llenos" });
  }

  if (password !== repeatPassword) {
    return res.status(400).json({ errorMessage: "La contraseña no coincide" });
  }

  if (passwordRegex.test(password) === false) {
    return res
      .status(400)
      .json({ errorMessage: "La contraseña no es lo suficientemente segura" });
  }

  if (emailRegex.test(email) === false) {
    return res
      .status(400)
      .json({ errorMessage: "El email no tiene el formato adecuado" });
  }

  try {
    const emailFound = await UserModel.findOne({ email: email });
    if (emailFound) {
      return res.status(400).json({ errorMessage: "Email registrado" });
    }
    const usernameFound = await UserModel.findOne({ username: username });
    if (usernameFound) {
      return res
        .status(400)
        .json({ errorMessage: "Nombre de Usuario registrado" });
    }
    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);

    await UserModel.create({
      username,
      email,
      password: hashPassword,
    });

    res.status(201).json("Usuario registrado");
  } catch (error) {
    next(error);
  }
});

router.post("/acceso", async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ errorMessage: "Los campos deben estar llenos" });
  }
  try {
    const userFound = await UserModel.findOne({ email: email });

    if (!userFound) {
      return res.status(400).json({ errorMessage: "Credenciales incorrectas" });
    } else {
      const checkPassword = await bcrypt.compare(password, userFound.password);

      if (!checkPassword) {
        return res
          .status(400)
          .json({ errorMessage: "Credenciales incorrectas" });
      }
    }
    const payload = {
      _id: userFound._id,
      email: userFound.email,
      username: userFound.username,
      profileImage: userFound.profileImage,
    };

    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "5d",
    });

    res.status(200).json({
      authToken,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/verify", isAuthenticated, (req, res, next) => {
  res.status(200).json(req.payload);
});

module.exports = router;
