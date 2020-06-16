<template>
  <div>
    <h4>Sous-cartons disponibles</h4>
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
}
</script>

<style scoped>
.error {
  color: red;
  font-style: italic;
}
</style>
