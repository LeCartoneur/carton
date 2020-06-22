# Description de l'interface avec la base de données Carton

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

## Récupérer tous les cartons originels dans la base

Un Carton originel est un carton sans carton parent.

- Route : `GET: /cartons/list`
- Response : `application/json` la liste des cartons originels.

## Récupérer tous les cartons (originels et sous-cartons) de la base

- Route : `GET: /cartons/list/all`
- Response : `application/json` la liste des cartons.

## Récupérer un carton par son id

- Route : `POST: /cartons/get`
- Body : `application/json`

```javascript
{
  id,
  sous_cartons: Boolean
}
```

- L'option `sous_cartons` permet de retourner les sous-cartons en tant qu'objets, sinon c'est leurs ids qui sont retournés.

- Response : `application/json` le carton souhaité en tant qu'objet.

## Ajouter un nouveau carton

- Route : `POST: /cartons/add`
- Body : `application/json` avec le nouveau carton.

## Modifier un carton existant

- Route : `POST: /cartons/update`
- Body `application/json`

```javascript
{
  carton_id: 'id',
  updates: [
    {
      path: 'nom',
      value: 'Nouveau nom',
      operation: 'set',
    },
    {
      path: 'versions.[0].quoi.sous_cartons',
      value: { carton_id: 'id', version_id: 0 },
      operation: 'push',
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

- Le path suit la [dot notation](https://docs.mongodb.com/manual/core/document/#document-dot-notation) de MongoDB.
- Operation peut être `set` pour remplacer le contenu d'une variable, `push` pour ajouter à la fin d'un array et `pull` pour supprimer un élement d'un array suivant une condition.

## Supprimer un carton par son id

- Route : `POST: /cartons/get`
- Body : `application/json`

```javascript
{
  id,
}
```

Tous les sous-cartons du carton seront supprimés de manière récursive.

## Réinitialiser la base

- Route : `DELETE /cartons/reset`
- Body : `application/json`

```javascript
{
  mdp: RESET_KEY;
}
```

- Response : 205 en cas de succès.
