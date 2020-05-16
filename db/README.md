# Description de l'interface avec la base de données Carton

> DISCLAIMER, API en cours de développement : les points d'entrée peuvent changer sans préavis et le contenu de la base de donnée peut être réinitialisé à tout moment.

## Description d'un objet carton

```javascript
user: String,
  id: ObjectId,
  parent: {
    type: ObjectId,
  },
  nom: String,
  private: { type: Boolean, default: false },
  versions: [
    {
      nom: String,
      quoi_texte: "",
      quoi_cartons: [ObjectId],
      fonction_texte: "",
      fonction_cartons: [ObjectId],
      comment_texte: "",
      comment_cartons: [ObjectId],
      exemples_texte: "",
      exemples_cartons: [ObjectId],
      plus_loin_cartons: [ObjectId],
    },
  ],
```

## Lister tous les cartons de la base

`GET: /cartons/list`

## Ajouter un nouveau carton

`POST: /cartons/add`

## Modifier un carton existant

`POST: /cartons/update`

## Supprimer tous les cartons

`DELETE: /cartons/reset` avec un body `application/json {id, update: {name: 'Nouveau nom', ...}}`
