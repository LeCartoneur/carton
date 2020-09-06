<template>
  <div id="nav">
    <router-link to="/">Accueil</router-link>
    |
    <router-link to="/carton">Carton</router-link>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({})
</script>

<style scoped>
#nav {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
}

a {
  margin: auto 1rem;
  align-self: center;
}

#nav {
  width: 100%;
  height: 35px;
  background-color: white;
}
</style>
