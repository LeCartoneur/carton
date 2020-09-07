<template>
  <div>
    <h1>
      Cartons disponibles
    </h1>
    <p class="carton__sous-titre">Cliquez sur un carton</p>
    <div class="carton__container-liste-cartons">
      <ul class="carton__liste-cartons">
        <li
          v-for="carton in cartons_originels"
          :key="carton.nom"
          @click="goToCarton(carton._id)"
          class="carton-link"
        >
          {{ carton.nom }}
        </li>
      </ul>
    </div>
    <p class="home__sous-titre">
      Ou
      <span class="carton__creer-carton" @click="createNewCarton">créez un nouveau carton</span>
      !
    </p>
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
      this.$router.push({ path: `/carton/${id}` })
    },
    /**
     * Get the list of all originels sous-cartons.
     */
    getCartonsList() {
      fetch(this.api_url + 'cartons/list', {
        method: 'GET',
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
      fetch(this.api_url + 'cartons', {
        method: 'POST',
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
h1 {
  margin: 2rem auto 0rem;
  text-align: center;
}

.carton__sous-titre {
  margin: auto;
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1rem;
  font-style: italic;
}

p {
  margin: auto;
  max-width: 600px;
  padding: 0 2rem;
  font-size: 1.2rem;
  text-align: center;
  margin-top: 1rem;
}

.carton__container-liste-cartons {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.carton__liste-cartons {
  margin: 1rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  max-width: 300px;
  flex-grow: 1;
  min-height: 200px;
  border: 1px dotted black;
  border-radius: 3px;
  background-color: blanchedalmond;
}

.carton__liste-cartons li {
  text-decoration: none;
  font-size: 1.1rem;
}
.carton__liste-cartons li:hover {
  text-decoration: none;
  font-style: italic;
}

.carton__creer-carton {
  font-style: italic;
  text-decoration: underline dotted rgb(255, 198, 112) 3px;
}
.carton__creer-carton:hover {
  font-style: normal;
  background-color: rgb(251, 219, 171);
}
</style>
