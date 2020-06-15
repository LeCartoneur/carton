<template>
  <div id="app">
    <carton />
  </div>
</template>

<script>
import Carton from './components/Carton.vue';

export default {
  name: 'App',
  components: {
    Carton,
  },
};
</script>

<style>
#app {
  box-sizing: border-box;
  height: 100vh;

  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
