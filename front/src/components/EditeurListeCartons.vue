<template>
  <div>
    <h4>Sous-cartons disponibles</h4>
    <div style="display: flex; flex-direction: column; align-items: center;">
      <input
        type="text"
        :value="new_carton"
        @input="validateSousCarton"
        placeholder="Nouveau carton"
      />
      <span v-if="new_carton_err !== ''" class="error">
        {{ new_carton_err }}
      </span>
      <button @click="addSousCarton">Ajouter un sous-carton</button>
    </div>
    <ul>
      <li v-for="nom in sous_cartons_noms" :key="nom">
        <span :class="{ error: cartons_no_refs.includes(nom) }">
          {{ nom }}
        </span>
        <button @click="delSousCarton(nom)">X</button>
      </li>
    </ul>
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
.error {
  color: red;
  font-style: italic;
}
</style>
