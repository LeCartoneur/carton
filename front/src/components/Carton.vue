<template>
  <div v-if="Object.keys(carton).length > 0" class="carton">
    <h1>{{ carton.nom }}</h1>
    <div class="volets-container">
      <volet
        v-for="volet in volets"
        :key="volet"
        :type="volet"
        :data="carton.versions[carton_version][volet]"
      ></volet>
    </div>
  </div>
  <div v-else class="carton">
    <h1>Il n'y a pas de carton :(</h1>
    <h3>... mais vous pouvez en sélectionner un parmi cette liste !</h3>
    <ul>
      <li
        v-for="carton in cartons_list"
        :key="carton.nom"
        @click="getCarton(carton._id, 0)"
        class="carton-link"
      >
        {{ carton.nom }}
      </li>
    </ul>
  </div>
</template>

<script>
import Volet from './Volet.vue'

export default {
  components: { Volet },
  data() {
    return {
      nom: 'Ordinateur',
      volets: ['quoi', 'comment', 'fonction'],
      carton: {},
      carton_version: 0,
      cartons_list: [],
    }
  },
  methods: {
    getCarton(id, version) {
      fetch('https://api.carton.combiendecarbone.fr/cartons/get', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          id,
          sous_carton: true,
        }),
      }).then((response) => {
        response.json().then((carton) => {
          this.carton = carton
          this.carton_version = version
        })
      })
    },
    getCartonsList() {
      fetch('https://api.carton.combiendecarbone.fr/cartons/list', {
        method: 'GET',
      }).then((response) => {
        response.json().then((cartons_list) => {
          this.cartons_list = cartons_list
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
  border: 2px solid black;
  overflow: scroll;
}

.volets-container {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: stretch;
  justify-content: space-between;
}

.carton-link:hover {
  background-color: coral;
}
</style>
