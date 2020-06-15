<template>
  <div v-if="Object.keys(carton).length > 0" class="carton">
    <h1 class="nom">
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
    <h1 class="nom">Vous n'avez pas de Carton ouvert! :(</h1>
    <h3 style="grid-area: 3 / 2 / 3 / 2;">
      ... mais vous pouvez en sélectionner un parmi cette liste !
    </h3>
    <ul style="grid-area: 2 / 2 / 2 / 2;">
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
      api_url: 'https://api.carton.combiendecarbone.fr/',
      //api_url: 'http://localhost:8000/',
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
      fetch(this.api_url + 'cartons/get', {
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
      fetch(this.api_url + 'cartons/list', {
        method: 'GET',
      }).then((response) => {
        response.json().then((cartons_originels) => {
          this.cartons_originels = cartons_originels
        })
      })
    },
    updateVoletsList() {
      let volets = []
      for (let cat of ['quoi', 'fonction', 'comment']) {
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
