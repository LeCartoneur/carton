const mongoose = require("mongoose");

const cartonSchema = new mongoose.Schema({
  user: String,
  parent: {
    type: mongoose.Types.ObjectId,
  },
  nom: String,
  private: { type: Boolean, default: false },
  versions: [
    {
      nom: String,
      quoi: {
        texte: String,
        sous_cartons: [
          {
            carton_id: mongoose.Types.ObjectId,
            version_id: { type: Number, default: 0 },
          },
        ],
      },
      fonction: {
        texte: String,
        sous_cartons: [
          {
            carton_id: mongoose.Types.ObjectId,
            version_id: { type: Number, default: 0 },
          },
        ],
      },
      comment: {
        texte: String,
        sous_cartons: [
          {
            carton_id: mongoose.Types.ObjectId,
            version_id: { type: Number, default: 0 },
          },
        ],
      },
      exemples: {
        texte: String,
        sous_cartons: [
          {
            carton_id: mongoose.Types.ObjectId,
            version_id: { type: Number, default: 0 },
          },
        ],
      },
      plus_loin: {
        sous_cartons: [
          {
            carton_id: mongoose.Types.ObjectId,
            version_id: { type: Number, default: 0 },
          },
        ],
      },
    },
  ],
});

const Carton = mongoose.model("Carton", cartonSchema);

module.exports = Carton;
