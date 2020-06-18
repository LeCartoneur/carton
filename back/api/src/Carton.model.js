const mongoose = require("mongoose");

const model_sous_carton = {
  carton_id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  version_id: { type: Number, default: 0 },
};

const model_category = {
  texte: {
    type: String,
    default: () => "",
  },
  sous_cartons: {
    type: [model_sous_carton],
    default: () => [],
  },
};

const model_version = {
  nom: {
    type: String,
    required: true,
  },
  quoi: model_category,
  fonction: model_category,
  comment: model_category,
  exemples: model_category,
  plus_loin: {
    sous_cartons: {
      type: [model_sous_carton],
      default: () => [],
    },
  },
};

const cartonSchema = new mongoose.Schema({
  user: {
    type: String,
    default: "default",
  },
  parent: {
    type: mongoose.Types.ObjectId,
    default: null,
  },
  nom: {
    type: String,
    required: true,
  },
  private: { type: Boolean, default: false },
  versions: {
    type: [model_version],
    default: () => [
      {
        nom: "default",
      },
    ],
  },
});

const Carton = mongoose.model("Carton", cartonSchema);

module.exports = Carton;
