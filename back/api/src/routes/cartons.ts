import express from "express";
import { carton_model } from "../connection";
import {
  Carton,
  Category,
  SousCarton,
  CartonVersion,
  CartonFlat,
} from "../models/Carton.model";

/**
 * Récupère la liste de tous les cartons originels par défaut,
 * et tous les cartons si `all` est vrai
 * @param req HTTP request
 * @param res HTTP response
 */
async function routeGetCartons(
  req: express.Request,
  res: express.Response
): Promise<void> {
  const all = req.query.all ? req.query.all : false;
  try {
    const cartons = await carton_model.find();
    if (all) {
      res.json(cartons);
    } else {
      res.json(cartons.filter((carton) => !carton.parent));
    }
  } catch {
    res.status(500).end();
  }
}

/**
 * Récupère un carton par son _id.
 * @param req HTTP request
 * @param res HTTP response
 */
export async function routeGetCartonById(
  req: express.Request,
  res: express.Response
): Promise<void> {
  const carton_id = req.params.id;
  const get_sous_cartons = req.query.sous_cartons
    ? !req.query.sous_cartons
    : false;
  try {
    const carton = await carton_model.findById(carton_id);
    if (carton) {
      if (get_sous_cartons) {
        res.json(carton);
      } else {
        Object.assign(carton, await populateVersions(carton));
        res.json(carton);
      }
    } else {
      res.status(404).end();
    }
  } catch {
    res.status(500).end();
  }
}

/**
 * For each sous-cartons lists in the current version, get back the full
 * carton object instead of just its id.
 * @param carton Carton object
 */
async function populateVersions(carton: Carton): Promise<Carton> {
  try {
    for (let v of carton.versions) {
      for (let type of ["comment", "quoi", "fonction", "exemples"]) {
        Object.assign(
          (v[type] as Category).sous_cartons,
          await getSubCartons(
            (v[type] as Category).sous_cartons as SousCarton[]
          )
        );
      }
    }
    return carton;
  } catch (err) {
    return Promise.reject(err);
  }
}

/**
 * Return a list of carton objects from a list of sub-carton objects
 * @param list_sous_cartons List of the sous-cartons to fetch
 */
async function getSubCartons(list_sous_cartons: SousCarton[]) {
  try {
    let sous_cartons: CartonFlat[] = [];
    for (let { carton_id, version_id } of list_sous_cartons) {
      let sous_carton = await carton_model.findById(carton_id).lean();
      if (sous_carton) {
        let version: CartonVersion;
        if (sous_carton.versions[version_id]) {
          version = sous_carton.versions[version_id];
        } else {
          version = sous_carton.versions.find((ver) => ver.nom === "default");
        }
        delete version.nom;
        delete (version as any)._id;
        delete sous_carton.versions;
        sous_cartons.push({
          ...(sous_carton as Omit<Carton, "versions">),
          ...(version as Omit<CartonVersion, "name">),
        });
      }
    }
    return sous_cartons;
  } catch (err) {
    return Promise.reject(err);
  }
}

/**
 * Ajoute un nouveau carton
 * @param req HTTP request
 * @param res HTTP response
 */
export async function routeInsertCarton(
  req: express.Request,
  res: express.Response
): Promise<void> {
  try {
    const carton = new carton_model(req.body);
    await carton.save().then((doc) => {
      res.status(201).json({ id: doc._id });
    });
  } catch {
    res.status(400).end();
  }
}

/**
 *  Met à jour un carton existant
 * @param req HTTP request
 * @param res HTTP response
 */
export async function routeUpdateCarton(
  req: express.Request,
  res: express.Response
): Promise<void> {
  const carton_id = req.params.id;
  try {
    const operations = ["push", "set", "pull"];
    await Promise.all(
      req.body.updates.map((update) => {
        if (operations.includes(update.operation)) {
          return carton_model.findByIdAndUpdate(carton_id, {
            [`$${update.operation}`]: {
              [update.path]: update.value,
            },
          });
        } else {
          return Promise.reject("Error: operation not specified");
        }
      })
    );
  } catch (error) {
    res.status(400).send(error);
  } finally {
    res.end();
  }
}

/**
 *  Delete a carton given its id. Recursively delete its sous-carton.
 * @param req HTTP request
 * @param res HTTP response
 */
export async function routeDeleteCarton(
  req: express.Request,
  res: express.Response
): Promise<void> {
  // TODO: ajouter vérification user === carton.user
  // TODO: faire les suppressions au sein d'une transaction
  // https://mongoosejs.com/docs/transactions.html
  const carton_id = req.params.id;
  try {
    await deleteSousCartons(carton_id);
  } catch (err) {
    res.status(400).send(err);
  } finally {
    res.status(200).end();
  }
}

/**
 * Recursively delete the sous-cartons of a carton
 * @param {Mongoose.ObjectId} carton_id Valid carton id
 */
async function deleteSousCartons(carton_id) {
  try {
    const sous_cartons = await getSousCartonsFlat(carton_id);
    await Promise.all(
      sous_cartons.map((sous_carton_id) => {
        deleteSousCartons(sous_carton_id);
      })
    );
    await carton_model.findByIdAndDelete(carton_id);
  } catch (err) {
    return Promise.reject(err);
  } finally {
    return Promise.resolve();
  }
}

/**
 * Return a flat list of all sous-cartons ids from all categories of
 * a given carton.
 * @param {Mongoose.ObjectId} carton_id Valid carton id
 */
async function getSousCartonsFlat(carton_id) {
  let sous_cartons_flat = [];
  try {
    let carton = await carton_model.findById(carton_id);
    if (carton.versions.length)
      carton.versions.forEach((v) => {
        ["quoi", "comment", "fonction", "exemples", "plus_loin"].forEach(
          (cat) => {
            v[cat].sous_cartons.forEach((sous_carton) =>
              sous_cartons_flat.push(sous_carton.carton_id)
            );
          }
        );
      });
  } catch (err) {
    console.log(err);
    return Promise.reject();
  } finally {
    return Promise.resolve(sous_cartons_flat);
  }
}

const router = express.Router();
router.get("/list", routeGetCartons);
router.get("/:id", routeGetCartonById);
router.post("/", routeInsertCarton);
router.put("/:id", routeUpdateCarton);
router.delete("/:id", routeDeleteCarton);

export default router;
