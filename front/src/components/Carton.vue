<template>
  <div v-if="Object.keys(carton).length > 0" class="carton">
    <h1>
      {{ carton.nom }}
      <span @click="getCarton(parent, 0)" v-if="parent">🔙</span>
    </h1>
    <div class="volets-container">
      <volet
        v-for="volet in volets"
        :key="volet.cat"
        :type="volet.cat"
        :data="carton.versions[carton_version][volet.cat]"
        :reduced="volet.reduced"
        @toggle-reduced="toggleVolet(volet)"
        @change-carton="(id) => getCarton(id, 0)"
      ></volet>
    </div>
  </div>
  <div v-else class="carton">
    <h1>Il n'y a pas de carton :(</h1>
    <h3>... mais vous pouvez en sélectionner un parmi cette liste !</h3>
    <ul>
      <li
        v-for="carton in cartons_originels"
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
      cartons_originels: [],
      carton: {},
      carton_version: 0,
      volets: [],
    }
  },
  computed: {
    n_volets() {
      return this.volets.length > 0 ? this.volets.filter((vol) => vol.reduced).length : 0
    },
    parent() {
      return this.carton.parent ? this.carton.parent : false
    },
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
          this.updateVoletsList()
        })
      })
    },
    getCartonsList() {
      fetch('https://api.carton.combiendecarbone.fr/cartons/list', {
        method: 'GET',
      }).then((response) => {
        response.json().then((cartons_originels) => {
          this.cartons_originels = cartons_originels
        })
      })
    },
    updateVoletsList() {
      let volets = []
      for (let cat of ['quoi', 'comment', 'fonction']) {
        let item = this.carton.versions[this.carton_version][cat]
        if (
          (item.sous_cartons ? item.sous_cartons.length > 0 : false) ||
          (item.texte ? item.texte !== '' : false)
        ) {
          volets.push({ cat: cat, reduced: false })
        }
      }
      this.volets = volets
    },
    toggleVolet(volet) {
      volet.reduced = !volet.reduced
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
  background-color: rgba(255, 250, 243, 0.541);
  overflow: scroll;
}

.volets-container {
  display: grid;
  grid-gap: 1em;
  padding: 1em;
}

@media (min-width: 700px) {
  .volets-container {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 700px) {
  .volets-container {
    grid-template-rows: repeat(3, 1fr);
  }
}

.carton-link:hover {
  background-color: coral;
}
</style>
