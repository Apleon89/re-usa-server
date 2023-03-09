const { Schema, model } = require("mongoose");

const adSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: [
    {
      type: String,
      enum: [
        "Videojuegos",
        "Telefonía",
        "Informática",
        "Imagen y Sonido",
        "Productos del hogar",
        "Deportes",
        "Motor",
        "Libros",
      ],
    },
  ],
  adImages: [String],
});

const AdModel = model ('Ad', adSchema)

module.exports = AdModel

