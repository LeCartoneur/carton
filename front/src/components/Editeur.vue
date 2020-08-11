<template>
  <button @click="save">Save</button>
</template>

<script>
import { fmtTxtEdit2Db } from '../plugins/formatTexte.js'

export default {
  props: {
    carton: {
      type: Object,
      required: true,
    },
    updates: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      api_url: process.env.VUE_APP_API_URL,
    }
  },
  computed: {
    /**
     * Order the updates by operations.
     */
    updates_ordered() {
      let updates_ordered = { add: [], delete: [], update_txt: [], set: [] }
      this.updates.forEach((update) => {
        updates_ordered[update.operation].push(update)
      })
      return updates_ordered
    },
  },
  methods: {
    /**
     * Freeze the carton object using JSON.parse(JSON.stringify())
     * to prevent data modification during the save process. Also
     * inject/remove any sub-cartons from the list of updates.
     */
    freezeAndUpdateCartonContent() {
      let carton = JSON.parse(JSON.stringify(this.carton))
      this.updates_ordered.add.forEach((update) => {
        carton[update.category].sous_cartons.push({ nom: update.value, _id: '' })
      })
      this.updates_ordered.delete.forEach((update) => {
        const idx = carton[update.category].sous_cartons.findIndex(
          (sous_carton) => sous_carton._id === update.value
        )
        carton[update.category].sous_cartons.splice(idx, 1)
      })
      return carton
    },
    /**
     * Wrapper to the API route POST '/cartons' to add a new carton to the DB.
     */
    async addNewCarton(sous_carton_nom) {
      let res = await fetch(this.api_url + 'cartons/', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          nom: sous_carton_nom,
          parent: this.carton._id,
          //TODO: replaced by the current user when implemented
          user: 'exemple',
        }),
      })
      let body = await res.json()
      return body.id
    },
    /**
     * Wrapper to the API route 'cartons/delete' to remove a carton from the DB.
     */
    async deleteSousCarton(sous_carton_id) {
      let res = await fetch(this.api_url + 'cartons/delete', {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: sous_carton_id }),
      })
      return res.status === 200 ? Promise.resolve() : Promise.reject()
    },
    /**
     * Wrapper to the API route 'carton/update' for updating a carton's sous-carton list.
     * @param {['push', 'pull']} mode
     * @param {MongoDB.id} sous_carton_id
     */
    async updateParentSousCartonsList(carton, update, sous_carton_id) {
      let carton_version_id = 0
      let operation = ''
      if (update.operation === 'add') operation = 'push'
      if (update.operation === 'delete') operation = 'pull'
      if (operation) {
        let value =
          operation === 'push'
            ? { carton_id: sous_carton_id, version: 0 }
            : { carton_id: sous_carton_id }
        return fetch(this.api_url + `cartons/${carton._id}`, {
          method: 'PUT',
          headers: {
            'content-type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            updates: [
              {
                path: `versions.${carton_version_id}.${update.category}.sous_cartons`,
                operation: operation,
                value: value,
              },
            ],
          }),
        }).then((response) => {
          return response.status === 200
        })
      } else return false
    },
    /**
     * Wrapper around the PUT cartons/:id route, specifically to update
     * the text of a carton's category (as the text must be format
     * with the updated ids of the sous-cartons).
     */
    updateCategoryText(carton, carton_version_id, update) {
      return fetch(this.api_url + `cartons/${carton._id}`, {
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          updates: [
            {
              path: `versions.${carton_version_id}.${update.category}.texte`,
              operation: 'set',
              value: fmtTxtEdit2Db(update.value, carton[update.category].sous_cartons),
            },
          ],
        }),
      }).then((response) => {
        return response.status === 200
      })
    },
    /**
     * Wrapper around the PUT cartons/:id route for generic set updates.
     */
    updateItem(carton, update) {
      return fetch(this.api_url + `cartons/${carton._id}`, {
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          updates: [
            {
              path: update.path,
              operation: 'set',
              value: update.value,
            },
          ],
        }),
      }).then((response) => {
        return response.status === 200
      })
    },
    /**
     * Process all the necessary updates made in the editor and their
     * corresponding API calls.
     * 1/ Delete any sous-cartons from the sous_cartons list,
     * 2/ Add any new sous-cartons to the sous_cartons list,
     * 3/ Update the category text
     */
    async save() {
      try {
        let carton = this.freezeAndUpdateCartonContent()
        // Add and remove sous-cartons
        await Promise.all(
          this.updates_ordered.add
            .map(async (update) => {
              const new_carton_id = await this.addNewCarton(update.value)
              const idx = carton[update.category].sous_cartons.findIndex(
                (sous_carton) => sous_carton.nom === update.value
              )
              carton[update.category].sous_cartons[idx]._id = new_carton_id
              await this.updateParentSousCartonsList(carton, update, new_carton_id)
            })
            .concat(
              this.updates_ordered.delete.map(async (update) => {
                const res = await this.deleteSousCarton(update.value)
                return res.status === 200
              })
            )
        )
        // Update texts
        await Promise.all(
          this.updates_ordered.update_txt.map(async (update) => {
            this.updateCategoryText(carton, 0, update)
          })
        )
        // Generic set updates
        await Promise.all(
          this.updates_ordered.set.map(async (update) => {
            this.updateItem(carton, update)
          })
        )
        // When everything is good, we can reload the carton
        this.$emit('reload')
      } catch (err) {
        Promise.reject(err)
      }
    },
  },
}
</script>

<style></style>
