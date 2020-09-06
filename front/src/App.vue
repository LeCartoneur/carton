<template>
  <div id="app">
    <navbar />
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Navbar from './components/Navbar.vue'

export default Vue.extend({
  components: {
    Navbar,
  },
})
</script>

<style>
#app {
  box-sizing: border-box;
  height: 100%;
}
#app * {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  height: calc(100vh - 35px);
}
</style>
