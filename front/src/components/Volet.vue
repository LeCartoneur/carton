<template>
  <div v-if="!reduced" :style="volet">
    <h2 @click="toggleVolet" :style="style">{{ config.titre }} -</h2>
    <p>
      <span
        v-for="txt in texte_format"
        :key="txt.txt"
        @click="callbackSousCartonText(txt)"
        :class="{ txt_link: txt.interact }"
      >
        {{ txt.txt }}
      </span>
    </p>
    <!-- <button @click="toggleSousCarton">
      {{ is_open_sous_carton ? 'Masquer' : 'Afficher' }}
    </button> -->
    <sous-carton
      v-if="is_open_sous_carton"
      :data="sous_cartons"
      @change-carton="(carton_id) => changeCarton(carton_id)"
    />
  </div>
  <div v-else :style="volet">
    <h2 @click="toggleVolet" :style="style" class="tranche">
      + {{ config.titre }}
    </h2>
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
  props: ['type', 'data', 'reduced'],
  data() {
    return {
      is_open_sous_carton: false,
      current_id_sous_carton: '',
      texte_format: [],
      sous_cartons: '',
    }
  },
  computed: {
    config() {
      return configs[this.type]
    },
    style() {
      return `
        background-color: ${this.config.color}
      `
    },
    volet() {
      return `
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
      this.$emit('toggle-reduced')
    },
    formatText() {
      let txt_fmt = []
      const regex = /{([^}]+)}/g
      let str = this.data.texte
      let res
      let start_index = 0
      while ((res = regex.exec(str)) !== null) {
        let reg_index = regex.lastIndex - res[0].length
        if (start_index !== reg_index) {
          txt_fmt.push({
            txt: str.slice(start_index, reg_index),
            interact: false,
          })
        }
        txt_fmt.push({
          txt: this.data.sous_cartons.find((carton) => carton._id === res[0].slice(1, -1)).nom,
          interact: true,
          id: res[0].slice(1, -1),
        })
        start_index = regex.lastIndex
      }
      if (start_index !== str.length) {
        txt_fmt.push({
          txt: str.slice(start_index, str.length),
          interact: false,
        })
      }
      this.texte_format = txt_fmt
    },
    callbackSousCartonText(txt) {
      if (txt.interact) {
        this.is_open_sous_carton = true
        this.sous_cartons = this.data.sous_cartons.find((carton) => carton._id === txt.id)
      }
    },
    changeCarton(carton_id) {
      this.$emit('change-carton', carton_id)
    },
  },
  mounted() {
    this.formatText()
  },
}
</script>

<style scoped>
.tranche {
  writing-mode: vertical-rl;
  text-orientation: mixed;
}

.txt_link {
  font-style: italic;
}

.txt_link:hover {
  background-color: rgb(253, 182, 182);
  font-style: normal;
}
</style>
