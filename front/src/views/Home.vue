<template>
  <div class="carton">
    <h1 class="nom">Vous n'avez pas de Carton ouvert! :(</h1>
    <h3 style="grid-area: 3 / 2 / 3 / 2;">
      ... mais vous pouvez en sélectionner un parmi cette liste !
    </h3>
    <ul style="grid-area: 2 / 2 / 2 / 2;">
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
    goToCarton(id) {
      this.$router.push({ path: `/visionneuse/${id}` })
    },
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
  },
  mounted() {
    this.getCartonsList()
  },
}
</script>

<style>
.carton {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border-style: inset;
  border-color: rgb(121, 93, 44);
  background-color: rgb(165, 136, 85);
  overflow-x: hidden;
  overflow-y: auto;
}

.nom {
  grid-column: 2;
  grid-row: 1;
  font-size: 3.5vw;
  text-align: center;
}

.volets-container {
  display: flex;

  grid-gap: 0.5em;

  grid-column: 2;
  grid-row: 2;
}

@media (min-width: 700px) {
  .carton {
    display: grid;
    grid-template-columns: 40px auto 40px;
    grid-template-rows: 15% 75% auto;

    border-width: 18px;
  }
  .volets-container {
    flex-direction: row;
  }
}

@media (max-width: 700px) {
  .carton {
    border-width: 8px;
  }

  .volets-container {
    flex-direction: column;
  }
}

.carton-link:hover {
  background-color: coral;
}
</style>
