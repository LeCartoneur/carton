<template>
  <div class="sous-carton" @click="changeCarton">
    <h3 style="text-align: center;">{{ carton.nom }}</h3>
    <p class="description">{{ description }}</p>
  </div>
</template>

<script>
import { splitTxt } from '../plugins/formatTexte.js'

export default {
  props: {
    carton: {
      type: Object,
      required: true,
    },
  },
  computed: {
    description() {
      if (this.carton.fonction) {
        return splitTxt(
          this.carton.fonction.texte
            ? this.carton.fonction.texte
            : 'Ce sous-carton ne contient pas de texte descriptif.'
        )
          .map((txt) => txt.txt)
          .join('')
      } else return ''
    },
  },
  methods: {
    changeCarton() {
      this.$emit('change-carton', this.carton._id)
    },
  },
}
</script>

<style>
.sous-carton {
  overflow: auto;

  grid-row: 4;

  box-sizing: border-box;
  border: 8px inset rgb(121, 93, 44);
  background-color: rgb(165, 136, 85);

  padding: 16px;
  margin: 10px 0px;
}
.sous-carton h3 {
  margin: 5px auto 7px;
  color: blueviolet;
}

.sous-carton:hover {
  background-color: rgb(153, 182, 182);
  cursor: pointer;
}

.sous-carton h3:hover {
  text-decoration: underline;
  font-style: bold;
}

.description {
  margin-top: 0;
  color: white;
  white-space: pre-wrap;
}
</style>
