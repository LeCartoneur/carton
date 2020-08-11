# Description de l'API Carton

Cette API permet de communiquer avec la base de données des Cartons afin de réaliser des tâches usuelles (récupération d'un carton, ajout, modification, suppression, etc.). Les routes disponibles sont les suivantes:

- [GET /cartons/list](#Récupérer-tous-les-cartons-de-la-base)
- [GET /cartons/:id](#Récupérer-un-carton-par-son-id)
- [POST /cartons/](#Ajouter-un-nouveau-carton)
- [PUT /cartons/:id](#Modifier-un-carton-existant)
- [DELETE /cartons/:id](#Supprimer-un-carton-par-son-id)

> DISCLAIMER, API en cours de développement : les points d'entrée peuvent changer sans préavis et le contenu de la base de donnée peut être réinitialisé à tout moment.

## Description d'un objet carton

```javascript
{
  user: String,
  _id: ObjectId, // Rempli par la base de données à l'insertion
  parent: ObjectId,
  nom: String,
  private: { type: Boolean, default: false },
  versions: [
    {
      nom: String,
      quoi: {
        texte: String,
        sous_cartons: [{
          carton_id: ObjectId,
          version_id: Number
        }]
      },
      fonction: {
        texte: String,
        sous_cartons: [{
          carton_id: ObjectId,
          version_id: Number
        }]
      },
      comment: {
        texte: String,
        sous_cartons: [{
          carton_id: ObjectId,
          version_id: Number
        }]
      },
      exemples: {
        texte: String,
        sous_cartons: [{
          carton_id: ObjectId,
          version_id: Number
        }]
      },
      plus_loin: {
        sous_cartons: [{
          carton_id: ObjectId,
          version_id: Number
        }]
      },
    },
  ]
}
```

## Récupérer tous les cartons de la base

Par défaut récupère tous les cartons originels (i.e. sans parent) de la base. Récupère tous les cartons avec ou sans parent si l'option `all` est à `true`.

- Route : `GET /cartons/list/?all=true|false`
- Response :
  - Type : `application/json`,
  - Body : une liste d'objets [`Carton`](#Description-d'un-objet-carton).

## Récupérer un carton par son id

- Route : `GET /cartons/:id/?sous_cartons=true|false`
- Response :
  - Type : `application/json`
  - Body : l'objet [`Carton`](#Description-d'un-objet-carton) souhaité.
  - Code : `200` si le carton est trouvé, `404` si non.
- L'option `sous_cartons` permet de retourner les sous-cartons en tant qu'objets [`Carton`](#Description-d'un-objet-carton), sinon c'est leurs ids qui sont retournés.

## Ajouter un nouveau carton

- Route : `POST /cartons`
- Requête :
  - Type : `application/json`
  - Body : un objet [`Carton`](#Description-d'un-objet-carton) représentant le nouveau carton.
- Réponse :
  - Type : `application/json`
  - Body : id du carton inséré
  - Code : `201` si l'insertion a eu lieu avec succès, `400` sinon.

## Modifier un carton existant

- Route : `PUT /cartons/:id`
- Requête :
  - Type : `application/json`
  - Body :
  ```javascript
  {
  updates: [
    {
      operation: 'set',
      path: 'nom',
      value: 'Nouveau nom',
    },
    {
      operation: 'push',
      path: 'versions.0.quoi.sous_cartons',
      value: { carton_id: 'id', version_id: 0 },
    },
    {
      operation: "pull",
      path: "versions.0.comment.sous_cartons",
      value: {
        carton_id: "sous_carton_id"
      }
    }
  ],
  }
  ```

* Le path suit la [_dot notation_](https://docs.mongodb.com/manual/core/document/#document-dot-notation) de MongoDB pour sélectionner une propriété d'un objet [`Carton`](#Description-d'un-objet-carton).
* L'opération peut être :
  - `set` pour remplacer le contenu d'une variable,
  - `push` pour ajouter à la fin d'un array,
  - `pull` pour supprimer un élement d'un array suivant une condition.

- Réponse :
  - Code : `200` si les modifications ont eu lieu, `400` sinon.

## Supprimer un carton par son id

- Route : `DELETE /cartons/:id`
- Réponse :
  - Code : `200` si le carton a bien été supprimé, `400` sinon.

Tous les sous-cartons du carton seront supprimés de manière récursive.
