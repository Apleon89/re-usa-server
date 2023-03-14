const router = require("express").Router();
const MessagesModel = require("../models/Messages.model");
const UserModel = require("../models/User.model");

//Listar todos los chat abiertos con otros usuarios
router.get("/", async (req, res, next) => {
  const activeUSer = req.payload;
  const openChats = [];
  try {
    const messages = await MessagesModel.find({
      $or: [
        { $and: [{ transmitter: activeUSer }] },
        { $and: [{ receiver: activeUSer }] },
      ],
    }).populate("transmitter receiver", "username profileImage");

    const ordenedArr = messages.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    ordenedArr.forEach((each) => {
      if (each.transmitter._id == activeUSer._id) {
        openChats.push({
          id: each.receiver._id,
          username: each.receiver.username,
          img: each.receiver.profileImage,
        });
      } else {
        openChats.push({
          id: each.transmitter._id,
          username: each.transmitter.username,
          img: each.transmitter.profileImage,
        });
      }
    });

    const filterMessages = openChats.filter((obj, index, self) => {
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

    res.status(200).json(filterMessages);
  } catch (error) {
    next(error);
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
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

// Listar todos los mensajes con un usuario
router.get("/:idUsuario", async (req, res, next) => {
  const { idUsuario } = req.params;
  const activeUSer = req.payload;
  try {
    const theOtherUser = await UserModel.findById(idUsuario).select(
      "username profileImage"
    );
    const mensajes = await MessagesModel.find({
      $or: [
        { $and: [{ transmitter: activeUSer }, { receiver: theOtherUser }] },
        { $and: [{ transmitter: theOtherUser }, { receiver: activeUSer }] },
      ],
    }).populate("transmitter receiver", "username profileImage");

    res.status(200).json([theOtherUser, mensajes]);
  } catch (error) {}
});

// Borrar todos los mensajes con un usuario
router.delete("/:idUsuario/borrarTodos", async (req, res, next) => {
  const { idUsuario } = req.params;
  const activeUser = req.payload;
  try {
    const theOtherUser = await UserModel.findById(idUsuario);
    const mensajes = await MessagesModel.find({
      $or: [
        { $and: [{ transmitter: activeUser }, { receiver: theOtherUser }] },
        { $and: [{ transmitter: theOtherUser }, { receiver: activeUser }] },
      ],
    }).select("_id");
    await MessagesModel.deleteMany({ _id: { $in: mensajes } });
    res.status(200).json("mensajes borrados");
  } catch (error) {
    next(error);
  }
});

// Editar un mensaje enviado
router.patch("/:idMensaje", async (req, res, next) => {
  const { idMensaje } = req.params;
  const { message } = req.body;
  try {
    await MessagesModel.findByIdAndUpdate(idMensaje, {
      message,
    });
    res.status(200).json("mensaje actualizado");
  } catch (error) {
    next(error);
  }
});

// Borrar un mensaje enviado
router.delete("/:idMensaje", async (req, res, next) => {
  const { idMensaje } = req.params;
  try {
    await MessagesModel.findByIdAndDelete(idMensaje);
    res.status(200).json("mensaje borrado");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
