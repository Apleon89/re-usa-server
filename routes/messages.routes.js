const router = require("express").Router();
const MessagesModel = require("../models/Messages.model");
const UserModel = require("../models/User.model");

//Listar todos los chat abiertos con otros usuarios
router.get("/", async (req, res, next) => {
  const activeUSer = req.payload;
  try {
    const messages = await MessagesModel.find({
      $or: [
        { $and: [{ transmitter: activeUSer }] },
        { $and: [{ receiver: activeUSer }] },
      ],
    }).populate("transmitter receiver", "username profileImage");

    const filterMessages = messages.filter((obj, index, self) => {
      return (
        index ===
        self.findIndex((o) => {
          return (
            JSON.stringify(o.id) === JSON.stringify(obj.id) &&
            o.username === obj.username
          );
        })
      );
    });

    res.json(filterMessages);
  } catch (error) {
    next(error);
    console.log(error);
  }
});

// Enviar un mensaje a un usuario
router.post("/:idUsuario", async (req, res, next) => {
  const { idUsuario } = req.params;
  const activeUSerId = req.payload._id;
  const { message } = req.body;

  try {
    const response = await MessagesModel.create({
      message,
      transmitter: activeUSerId,
      receiver: idUsuario,
    });
    console.log(response);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Listar todos los mensajes con un usuario
router.get("/:idUsuario", async (req, res, next) => {
  const { idUsuario } = req.params;
  const activeUSer = req.payload;
  try {
    const theOtherUser = await UserModel.findById(idUsuario);
    const mensajes = await MessagesModel.find({
      $or: [
        { $and: [{ transmitter: activeUSer }, { receiver: theOtherUser }] },
        { $and: [{ transmitter: theOtherUser }, { receiver: activeUSer }] },
      ],
    }).populate("transmitter receiver", "username profileImage");

    console.log(mensajes);
    res.json(mensajes);
  } catch (error) {}
});

module.exports = router;

