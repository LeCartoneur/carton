<template>
  <div class="about">
    <h1>Bienvenue sur carton.wiki !</h1>

    <p>
      carton.wiki vous permet d'apprendre en décomposant des notions en sous-notions, elle aussi
      décomposées en sous-notions.
    </p>

    <p>
      Une notion est appelée <em>carton</em> et les sous-notions qui lui sont attachées sont ses
      <em>sous-cartons</em>.
    </p>

    <p>
      Chaque carton possède 3 volets : <em>qu'est-ce que c'est</em>, <em>qu'esc-ce que ça fait</em>,
      et <em>comment ça le fait</em>. Chaque volet se compose ensuite d'un texte explicatif et des
      sous-cartons.
    </p>

    <p>
      Chaque carton peut être modifié (texte explicatif, sous-cartons) et vous pouvez même créer vos
      propres cartons !
    </p>

    <button @click="$router.push({ path: `/carton` })">Parcourir les cartons</button>
    <div class="version-beta">
      <p>
        carton.wiki est en cours de développement : toutes les fonctionnalités ne sont pas encore
        présentes et vous rencontrerez probablement quelques bugs (que vous pouvez nous
        <a
          target="_blank"
          href="https://github.com/LeCartoneur/carton/issues/new?assignees=&labels=bug&template=rapport-de-bug.md&title="
          >signaler</a
        >).
      </p>
      <p>
        Vous pouvez librement modifier des cartons existants et en créer des nouveaux mais il se
        peut qu'ils soient supprimés sans préavis lors du développement.
      </p>
    </div>
  </div>
</template>

<style scoped>
h1 {
  margin: 2rem auto 1rem;
  text-align: center;
}

p {
  margin: 0.5rem auto;
  max-width: 600px;
  padding: 0 2rem;
  font-size: 1.2rem;
  text-align: justify;
}

button {
  padding: 10px;
  margin: 2rem auto;
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

.version-beta {
  margin: 2rem auto;
  max-width: 500px;
  padding: 1rem 1.3rem;
  border: 1px dotted red;
  background-color: rgba(214, 44, 78, 0.219);
}

.version-beta p {
  padding: 0;
  text-align: justify;
  font-size: 1.1rem;
  color: rgb(61, 61, 61);
}
</style>
