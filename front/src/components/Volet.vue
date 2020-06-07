<template>
  <div v-if="is_open_volet" :style="volet">
    <h2 @click="toggleVolet" :style="style">{{ config.titre }} -</h2>
    <p v-html="texte_format"></p>
    <button @click="toggleSousCarton">{{ is_open_sous_carton ? 'Masquer' : 'Afficher' }}</button>
    <sous-carton v-if="is_open_sous_carton" />
  </div>
  <div v-else :style="volet">
    <h2 @click="toggleVolet" :style="style" class="tranche">+ {{ config.titre }}</h2>
  </div>
</template>

<script>
import SousCarton from './SousCarton.vue'

const configs = {
  fonction: {
    titre: 'Keçafait',
    color: 'orange',
  },
  quoi: {
    titre: 'Keçeçe',
    color: 'green',
  },
  comment: {
    titre: "Komment ça l'fait",
    color: 'blue',
  },
}

export default {
  components: {
    SousCarton,
  },
  // TODO: use correct Vue.js props definition/syntax
  props: ['type', 'data'],
  data() {
    return {
      is_open_volet: true,
      is_open_sous_carton: false,
      current_id_sous_carton: '',
      texte_format: '',
    }
  },
  computed: {
    config() {
      return configs[this.type]
    },
    style() {
      return `background-color: ${this.config.color}`
    },
    volet() {
      return `
        margin: 1rem;
        padding: 1rem;
        border: 1px solid ${this.config.color};
        flex-grow: 1;
        flex-shrink: 1;
      `
    },
  },
  watch: {
    data() {
      this.formatText()
    },
  },
  methods: {
    toggleSousCarton() {
      this.is_open_sous_carton = !this.is_open_sous_carton
    },
    toggleVolet() {
      this.is_open_volet = !this.is_open_volet
    },
    formatText() {
      const regex = /{([^}]+)}/g
      this.texte_format = this.data.texte.replace(regex, (id) => {
        return `
          <span>
          ${this.data.sous_cartons.find((carton) => carton._id === id.slice(1, -1)).nom}
          </span>
        `
      })
    },
  },
  mounted() {
    this.formatText()
  },
}
</script>

<style>
.tranche {
  writing-mode: vertical-rl;
  text-orientation: mixed;
}
</style>
