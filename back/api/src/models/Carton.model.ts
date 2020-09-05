import mongoose from "mongoose";

const model_sous_carton = {
  carton_id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  version_id: { type: Number, default: 0 },
};

export interface SousCarton {
  carton_id: mongoose.Types.ObjectId;
  version_id: number;
}

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

export interface Category {
  texte: string;
  sous_cartons: SousCarton[] | CartonVersion[];
}

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

export interface CartonVersion {
  nom: string;
  quoi: Category;
  fonction: Category;
  comment: Category;
  exemples: Category;
  plus_loin: SousCarton[];
}

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

export interface Carton extends mongoose.Document {
  user: string;
  parent: mongoose.Types.ObjectId;
  nom: string;
  private: Boolean;
  versions: CartonVersion[];
}

export type CartonFlat = Omit<Carton, "versions"> &
  Omit<CartonVersion, "name>">;

export default cartonSchema;
