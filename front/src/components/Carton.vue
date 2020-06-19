<template>
  <div class="carton">
    <toolbar :mode_actif="mode_actif" @mode-update="(id) => updateMode(id)" />
    <h1 class="nom">
      {{ carton.nom }}
      <span @click="goToCarton(parent)" v-if="parent">🔙</span>
    </h1>
    <div class="volets-container">
      <volet
        v-for="volet in volets"
        :key="volet.cat"
        :category="volet.cat"
        :data="carton.versions[carton_version][volet.cat]"
        :parent_id="carton._id"
        :reduced="volet.reduced"
        :can_reduce="n_volets < 2"
        :editor="mode_actif === 1"
        @toggle-reduced="toggleVolet(volet)"
        @change-carton="(id) => goToCarton(id)"
      ></volet>
    </div>
  </div>
</template>

<script>
import Volet from './Volet.vue'
import Toolbar from './Toolbar.vue'

export default {
  components: { Volet, Toolbar },
  props: {
    carton_id: {
      required: true,
    },
  },
  data() {
    return {
      api_url: process.env.VUE_APP_API_URL,
      carton: {},
      carton_version: 0,
      carton_ready: false,
      mode_actif: 0, //0: Visionneuse ||1: Editeuse ||2: Commenteuse
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
    loadCarton() {
      fetch(this.api_url + 'cartons/get', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          id: this.carton_id,
          sous_carton: true,
        }),
      })
        .then((response) => {
          return response.json()
        })
        .then((carton) => {
          this.carton = carton
          this.carton_ready = true
          this.loadVolets()
        })
    },
    loadVolets() {
      let volets = []
      for (let cat of ['quoi', 'fonction', 'comment']) {
        let item = this.carton.versions[this.carton_version][cat]
        if (
          item.sous_cartons.length > 0 ||
          item.texte !== '' ||
          this.mode_actif === 1 // On affiche tout en mode éditeur
        ) {
          volets.push({ cat: cat, reduced: false })
        }
      }
      this.volets = volets
    },
    toggleVolet(volet) {
      volet.reduced = !volet.reduced
    },
    updateMode(id) {
      this.mode_actif = id
    },
    goToCarton(id) {
      this.$router.push({ path: `/visionneuse/${id}` })
    },
  },
  mounted() {
    this.loadCarton()
  },
  watch: {
    $route(to, from) {
      if (to.params.carton_id !== from.params.carton_id) {
        this.loadCarton()
      }
    },
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
