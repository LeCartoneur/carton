<template>
  <div class="container">
    <editeur-volet-texte
      v-model="txt_edit"
      :sous_cartons_noms="sous_cartons_noms"
      :refs_no_cartons="refs_no_cartons"
      @add-sous-carton="(e) => addSousCartons(e)"
    />
    <editeur-volet-liste-cartons
      :sous_cartons_noms="sous_cartons_noms"
      :cartons_no_refs="cartons_no_refs"
      @add-sous-carton="(e) => addSousCartons(e)"
      @del-sous-carton="(e) => delSousCartons(e)"
    />
    <!-- <button @click="save">Save</button> -->
  </div>
</template>

<script>
import EditeurVoletListeCartons from './EditeurVoletListeCartons.vue'
import EditeurVoletTexte from './EditeurVoletTexte.vue'
import { fmtTxtDb2Edit, getRegex } from '../plugins/formatTexte.js'
export default {
  components: {
    EditeurVoletListeCartons,
    EditeurVoletTexte,
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
      update_ready: true,
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
      const regex = getRegex()
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

      // Check if all's good to push the pending updates
      if (this.refs_no_cartons.length === 0 && this.cartons_no_refs.length === 0) {
        this.$emit('update-ready', this.formatUpdates())
      }
    },
    /**
     * Format the update into object that can be understood by the Editor
     * component {category, operation, path, value}.
     */
    formatUpdates() {
      let updates = []

      this.new_sous_cartons.forEach((carton) => {
        updates.push({
          category: this.category,
          operation: 'add',
          path: `versions[0].${this.category}.sous_cartons`,
          value: carton.nom,
        })
      })

      this.del_sous_cartons.forEach((carton) => {
        updates.push({
          category: this.category,
          operation: 'delete',
          path: `versions[0].${this.category}.sous_cartons`,
          value: carton._id,
        })
      })

      updates.push({
        category: this.category,
        operation: 'update_txt',
        path: `versions[0].${this.category}.texte`,
        value: this.txt_edit,
      })

      return updates
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
