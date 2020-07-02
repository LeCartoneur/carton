<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
      |
      <router-link to="/about">About</router-link>
      |
      <router-link to="/signin">Sign in</router-link>
    </div>
    <router-view />
  </div>
</template>

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

#nav {
  position: absolute;
  right: 2vw;
  bottom: 0;
}

body {
  height: 100vh;
}
</style>
