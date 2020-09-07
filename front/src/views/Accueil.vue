<template>
  <div class="about">
    <h1>Bienvenue sur carton.wiki !</h1>

    <p>
      carton.wiki vous permet d'apprendre en décomposant des notions en sous-notions, elle aussi
      décomposées en sous-notions.
    </p>

    <button @click="$router.push({ path: `/carton` })">Parcourir les cartons</button>
  </div>
</template>

<style scoped>
h1 {
  margin: 2rem auto 1rem;
  text-align: center;
}

p {
  margin: auto;
  max-width: 600px;
  padding: 0 2rem;
  font-size: 1.2rem;
}

button {
  padding: 10px;
  margin: 1rem auto;
  display: block;
  border-radius: 3px;
  border: 1px solid black;
  font-size: 1.1rem;
  background-color: blanchedalmond;
}

button:hover {
  padding: 9px;
  border: 2px solid black;
  background-color: rgb(251, 219, 171);
}
</style>
