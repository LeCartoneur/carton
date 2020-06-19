<template>
  <div class="container">
    <editeur-texte
      v-model="txt_edit"
      :sous_cartons_noms="sous_cartons_noms"
      :refs_no_cartons="refs_no_cartons"
    />
    <editeur-liste-cartons
      :sous_cartons_noms="sous_cartons_noms"
      :cartons_no_refs="cartons_no_refs"
      @add-sous-carton="(e) => addSousCartons(e)"
      @del-sous-carton="(e) => delSousCartons(e)"
    />
    <button @click="update">Save</button>
  </div>
</template>

<script>
import EditeurListeCartons from './EditeurListeCartons.vue'
import EditeurTexte from './EditeurTexte.vue'
import { fmtTxtDb2Edit, fmtTxtEdit2Db } from '../plugins/formatTexte.js'
export default {
  components: {
    EditeurListeCartons,
    EditeurTexte,
  },
  props: {
    parent_id: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    data: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      api_url: process.env.VUE_APP_API_URL,
      txt_edit: fmtTxtDb2Edit(this.data.texte, this.data.sous_cartons),
      new_sous_cartons: [],
      del_sous_cartons: [],
      refs_no_cartons: [],
      cartons_no_refs: [],
    }
  },
  computed: {
    /**
     * Holds all the current sous-cartons names, i.e. names =
     *    sous_cartons in DB
     *    + new_sous_cartons
     *    - del_sous_cartons
     */
    sous_cartons_noms() {
      let noms = []
      this.data.sous_cartons.forEach((carton) => noms.push(carton.nom))
      this.new_sous_cartons.forEach((carton) => noms.push(carton.nom))
      this.del_sous_cartons.forEach((carton) => {
        let idx = noms.findIndex((item) => item === carton.nom)
        if (idx > -1) noms.splice(idx, 1)
      })
      return noms
    },
    /**
     * The volet is ready, i.e. user's modifications can be pushed to
     * the DB, if there is no sous-cartons with no references in the text
     * and if there is no references in the text with no matching sous-cartons.
     * Based on the results from checkSousCartonsRefs().
     */
    update_ready() {
      return this.refs_no_cartons.length === 0 && this.cartons_no_refs.length === 0
    },
  },
  watch: {
    txt_edit() {
      this.checkSousCartonsRefs()
    },
  },
  methods: {
    /**
     * Add a new sous carton to the list of sous-cartons to be pushed into the DB.
     */
    addSousCartons(new_name) {
      this.new_sous_cartons.push({ nom: new_name })
      this.checkSousCartonsRefs()
    },
    /**
     * Remove a sous carton either by removing it from the list of the new sous-cartons
     * if it has not been inserted into the DB yet, or by adding it to the list of
     * sous-cartons to be removed from the DB.
     */
    delSousCartons(carton_nom) {
      let idx = this.new_sous_cartons.findIndex((item) => item.nom === carton_nom)
      if (idx > -1) {
        this.new_sous_cartons.splice(idx, 1)
      } else {
        let carton_id = this.data.sous_cartons.find((carton) => carton.nom === carton_nom)._id
        this.del_sous_cartons.push({ nom: carton_nom, _id: carton_id })
      }
      this.checkSousCartonsRefs()
    },
    /**
     * All references in the text must reference an existing sous carton
     * and all sous cartons must be referenced by at least one link in the
     * text.
     */
    checkSousCartonsRefs() {
      // Find references in text
      const regex = /{([^}]+)}\(([^}]+)\)/g
      let refs = [...this.txt_edit.matchAll(regex)]

      // Find references with no matching sous cartons
      this.refs_no_cartons = []
      refs.forEach((ref) => {
        if (!this.sous_cartons_noms.find((name) => name === ref[1])) {
          this.refs_no_cartons.push(ref[1])
        }
      })

      // Find sous cartons not referenced in the text
      this.cartons_no_refs = []
      this.sous_cartons_noms.forEach((nom) => {
        if (!refs.find((ref) => ref[1] === nom)) {
          this.cartons_no_refs.push(nom)
        }
      })
    },
    /**
     * Wrapper to the API route 'cartons/add' to add a new carton to the DB.
     */
    async postNewCarton(nom) {
      let res = await fetch(this.api_url + 'cartons/add', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          nom: nom,
          parent: this.parent_id,
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
    async deleteSousCarton(carton_id) {
      let res = await fetch(this.api_url + 'cartons/delete', {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: carton_id }),
      })
      return res.status === 200 ? Promise.resolve() : Promise.reject()
    },
    /**
     * Wrapper to the API route 'carton/update' for updating a carton's sous-carton list.
     * @param {['push', 'pull']} mode
     * @param {MongoDB.id} sous_carton_id
     */
    updateParentSousCartons(mode, sous_carton_id) {
      if (['push', 'pull'].includes(mode)) {
        let value =
          mode === 'push'
            ? { carton_id: sous_carton_id, version: 0 }
            : { carton_id: sous_carton_id }
        return fetch(this.api_url + 'cartons/update', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            id: this.parent_id,
            updates: [
              {
                path: `versions.0.${this.category}.sous_cartons`,
                operation: mode,
                value: value,
              },
            ],
          }),
        }).then((response) => {
          return response.status === 200
        })
      } else return false
    },
    postTexteUpdate(sous_cartons) {
      return fetch(this.api_url + 'cartons/update/text', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          id: this.parent_id,
          version: '0',
          cat: this.category,
          txt: fmtTxtEdit2Db(this.txt_edit, sous_cartons),
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
    async update() {
      if (this.update_ready) {
        let cartons = this.data.sous_cartons.map((carton) => {
          return { nom: carton.nom, _id: carton._id }
        })
        await Promise.all(
          this.new_sous_cartons
            .map(async (carton) => {
              let id = await this.postNewCarton(carton.nom)
              cartons.push({ nom: carton.nom, _id: id })
              this.updateParentSousCartons('push', id)
            })
            .concat(
              this.del_sous_cartons.map(async (carton) => {
                await this.deleteSousCarton(carton._id)
                let idx = cartons.findIndex((c) => c._id === carton._id)
                if (idx > -1) cartons.splice(idx, 1)
                this.updateParentSousCartons('pull', carton._id)

                // TODO: on success must update the parent's sous-cartons list
              })
            )
        )
        this.postTexteUpdate(cartons)
        this.$emit('reload')
      }
    },
  },
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.container textarea {
  margin: 1rem;
}
</style>
