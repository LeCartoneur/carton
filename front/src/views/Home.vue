<template>
  <div class="home">
    <h1 class="home__titre">Vous n'avez pas de Carton ouvert! :(</h1>
    <h3 class="home__sous-titre">
      ... mais vous pouvez en sélectionner un parmi cette liste :
    </h3>
    <ul class="home__liste-cartons">
      <li
        v-for="carton in cartons_originels"
        :key="carton.nom"
        @click="goToCarton(carton._id)"
        class="carton-link"
      >
        {{ carton.nom }}
      </li>
    </ul>
    <h3 class="home__sous-titre">
      .. ou bien
      <span class="home__creer-carton" @click="createNewCarton">créer un nouveau carton</span>
      !
    </h3>
  </div>
</template>

<script>
export default {
  data() {
    return {
      api_url: process.env.VUE_APP_API_URL,
      cartons_originels: [],
      carton: {},
      carton_version: 0,
    }
  },
  methods: {
    /**
     * Programmatically goes to a new carton using
     * vue router.
     */
    goToCarton(id) {
      this.$router.push({ path: `/visionneuse/${id}` })
    },
    /**
     * Get the list of all originels sous-cartons.
     */
    getCartonsList() {
      fetch(this.api_url + 'cartons/list', {
        method: 'GET',
        credentials: 'include',
      }).then((response) => {
        response.json().then((cartons_originels) => {
          this.cartons_originels = cartons_originels
        })
      })
    },
    /**
     * Create a new sous-carton and jump into it.
     */
    createNewCarton() {
      fetch(this.api_url + 'cartons/add', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          nom: 'Mon nouveau carton',
        }),
      })
        .then((response) => response.json())
        .then((body) => {
          this.goToCarton(body.id)
        })
    },
  },
  mounted() {
    this.getCartonsList()
  },
}
</script>

<style scoped>
.home {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border-style: inset;
  border-color: rgb(121, 93, 44);
  background-color: rgb(165, 136, 85);
  overflow-x: hidden;
  overflow-y: auto;

  padding: 0 40px;
  display: flex;
  flex-direction: column;

  border-width: 18px;
}

.home__titre {
  font-size: 2rem;
  text-align: center;
}

.home__sous-titre {
  font-size: 1.5rem;
}

.home__liste-cartons li {
  font-size: 1.3rem;
}
@media (max-width: 700px) {
  .home {
    border-width: 8px;
  }
}

.carton-link:hover {
  background-color: coral;
}

.home__creer-carton {
  font-style: italic;
  text-decoration: underline dotted khaki;
}
.home__creer-carton:hover {
  font-style: normal;
  background-color: khaki;
}
</style>
