<template>
  <div class="carton">
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
    }
  },
  methods: {
    getCarton(id, version) {
      fetch('http://54.37.229.17:8000/cartons/get', {
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
  },
  mounted() {
    this.getCarton('5ee3361daf0d2700199caf04', 0)
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
</style>
