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
      quoi_texte: "",
      quoi_cartons: [mongoose.Types.ObjectId],
      fonction_texte: "",
      fonction_cartons: [mongoose.Types.ObjectId],
      comment_texte: "",
      comment_cartons: [mongoose.Types.ObjectId],
      exemples_texte: "",
      exemples_cartons: [mongoose.Types.ObjectId],
      plus_loin_cartons: [mongoose.Types.ObjectId],
    },
  ],
});

const Carton = mongoose.model("Carton", cartonSchema);

module.exports = Carton;
