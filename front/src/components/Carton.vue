<template>
  <div class="carton">
    <h1>{{ nom }}</h1>
    <div class="volets-container">
      <volet v-for="volet in volets" :key="volet" :type="volet"></volet>
    </div>
  </div>
</template>

<script>
import Volet from './Volet.vue';

export default {
  components: { Volet },
  data() {
    return {
      nom: 'Ordinateur',
      volets: ['quoi', 'comment', 'fonction'],
    };
  },
};
</script>

<style>
.carton {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border: 2px solid black;
  overflow: scroll;
}

.volets-container {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: stretch;
}
</style>
