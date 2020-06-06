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
        sous_cartons: [mongoose.Types.ObjectId],
      },
      fonction: {
        texte: String,
        sous_cartons: [mongoose.Types.ObjectId],
      },
      comment: {
        texte: String,
        sous_cartons: [mongoose.Types.ObjectId],
      },
      exemples: {
        texte: String,
        sous_cartons: [mongoose.Types.ObjectId],
      },
      plus_loin_cartons: [mongoose.Types.ObjectId],
    },
  ],
});

const Carton = mongoose.model("Carton", cartonSchema);

module.exports = Carton;
