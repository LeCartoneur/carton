<template>
  <div>
    <h4>Sous-cartons disponibles</h4>
    <input type="text" v-model="new_carton" placeholder="Nouveau carton" />
    <button @click="addSousCarton">Ajouter un sous-carton</button>
    <ul>
      <li v-for="nom in sous_cartons_noms" :key="nom">
        <span :class="{ error: cartons_no_refs.includes(nom) }">
          {{ nom }}
        </span>
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
    }
  },
  methods: {
    addSousCarton() {
      if (!this.sous_cartons_noms.includes(this.new_carton)) {
        this.$emit('add-sous-carton', this.new_carton)
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
