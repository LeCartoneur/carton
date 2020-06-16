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
      //api_url: 'http://localhost:8000/',
      api_url: 'https://api.carton.combiendecarbone.fr/',
      txt_edit: fmtTxtDb2Edit(this.data.texte, this.data.sous_cartons),
      new_sous_cartons: [],
      refs_no_cartons: [],
      cartons_no_refs: [],
    }
  },
  computed: {
    sous_cartons_noms() {
      let noms = []
      this.data.sous_cartons.forEach((carton) => noms.push(carton.nom))
      this.new_sous_cartons.forEach((carton) => noms.push(carton.nom))
      return noms
    },
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
    addSousCartons(new_name) {
      this.new_sous_cartons.push({ nom: new_name })
      this.checkSousCartonsRefs()
    },
    /**
     * All references in the texte must reference an existing sous carton
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
    postNewCarton(nom) {
      return fetch(this.api_url + 'cartons/add', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          nom,
          user: 'exemple',
        }),
      })
        .then((response) => {
          return response.json()
        })
        .then((body) => {
          return body.id
        })
    },
    updateParentSousCartons(sous_cartons_id) {
      return fetch(this.api_url + 'cartons/update/sous_cartons', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          id: this.parent_id,
          version: '0',
          cat: this.category,
          carton: { carton_id: sous_cartons_id, version: 0 },
        }),
      }).then((response) => {
        return response.status === 200
      })
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
    async update() {
      if (this.update_ready) {
        let cartons = this.data.sous_cartons.map((carton) => {
          return { nom: carton.nom, _id: carton._id }
        })
        await Promise.all(
          this.new_sous_cartons.map(async (carton) => {
            let id = await this.postNewCarton(carton.non)
            cartons.push({ nom: carton.nom, _id: id })
          })
        )
        this.postTexteUpdate(cartons)
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
