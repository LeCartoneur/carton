<template>
  <div class="editor">
    <h4 style="margin-bottom: 0;">Sous-cartons disponibles</h4>
    <ul class="editor__liste_sous_cartons">
      <li v-for="nom in sous_cartons_noms" :key="nom">
        <span :class="{ error: cartons_no_refs.includes(nom) }">
          {{ nom }}
        </span>
        <button @click="delSousCarton(nom)">🗑</button>
      </li>
    </ul>
    <p v-if="cartons_no_refs.length > 0" class="error">
      Certains sous-cartons ne sont pas référencés dans le texte.
    </p>
    <h5>Ajouter un nouveau sous-carton</h5>
    <div class="editor__ajout_sous_cartons">
      <span class="editor__ajout_sous_cartons__inputs">
        <input
          type="text"
          :value="new_carton"
          @input="validateSousCarton"
          placeholder="Nom du sous-carton"
        />
        <button @click="addSousCarton">+</button>
      </span>
      <span v-if="new_carton_err !== ''" class="error">
        {{ new_carton_err }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    sous_cartons_noms: {
      type: Array,
      default: () => [],
    },
    cartons_no_refs: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      new_carton: '',
      new_carton_err: '',
    }
  },
  methods: {
    addSousCarton() {
      this.validateSousCarton()
      let new_carton_trim = this.new_carton.trim()
      if (this.new_carton_err === '') {
        this.$emit('add-sous-carton', new_carton_trim)
        this.new_carton = ''
      }
    },
    validateSousCarton(e) {
      if (e) this.new_carton = e.target.value
      let new_carton_trim = this.new_carton.trim()
      if (this.sous_cartons_noms.includes(new_carton_trim)) {
        this.new_carton_err = 'Ce carton existe déjà'
        return
      } else if (new_carton_trim === '') {
        this.new_carton_err = 'Veuillez entrer une valeur'
        return
      } else {
        this.new_carton_err = ''
        return
      }
    },
    delSousCarton(nom) {
      if (this.sous_cartons_noms.includes(nom)) {
        this.$emit('del-sous-carton', nom)
      }
    },
  },
}
</script>

<style scoped>
.editor {
  width: 100%;
}

.editor button {
  width: 28px;
  height: 28px;
  padding: 0;
  font-size: 1rem;
  margin-left: 10px;
  border: 2px solid #ccc;
  border-radius: 4px;
  background-color: #f8f8f8;
}
.error {
  color: red;
  font-style: italic;
}
.editor__liste_sous_cartons {
  padding-left: 20px;
  margin-top: 0.5rem;
}
.editor__ajout_sous_cartons {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.editor__ajout_sous_cartons input {
  box-sizing: border-box;
  border: 2px solid #ccc;
  border-radius: 4px;
  background-color: #f8f8f8;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-size: 1rem;
  padding-left: 7px;
}

.editor__ajout_sous_cartons__inputs {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
