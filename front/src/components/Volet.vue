<template>
  <div v-if="!reduced" :style="volet" class="volet">
    <div class="toggle" @click="toggleVolet">-</div>
    <h2>{{ config.titre }}</h2>
    <p>
      <span
        v-for="txt in texte_format"
        :key="txt.txt"
        @click="callbackSousCartonText(txt)"
        :class="{ txt_link: txt.interact }"
      >{{ txt.txt }}</span>
    </p>

    <sous-carton
      v-if="is_open_sous_carton"
      :data="sous_cartons"
      @change-carton="(carton_id) => changeCarton(carton_id)"
    />
  </div>
  <div v-else :style="volet" class="tranche" @click="toggleVolet">
    <div class="toggle" @click="toggleVolet">+</div>
    <h2>{{ config.titre }}</h2>
  </div>
</template>

<script>
import SousCarton from './SousCarton.vue'

const configs = {
  quoi: {
    titre: 'Keçeçe',
    color: 'rgba(0, 229, 255, 1)',
  },
  fonction: {
    titre: 'Keçafait',
    color: 'rgba(29, 233, 182, 1)',
  },
  comment: {
    titre: "Komment ça l'fait",
    color: 'rgba(0, 230, 118, 1)',
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
    volet() {
      return `
        background-color: ${this.config.color};
        border-color: ${this.config.color};
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
.toggle {
  position: absolute;
  top: 5px;
  right: 5px;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 35px;
  height: 35px;
  border-radius: 20px;

  background-color: black;
  color: white;
}

.tranche .toggle {
  top: 20px;
  right: unset;

  background-color: white;
  color: black;
}

.volet,
.tranche {
  position: relative;
  border-style: inset;
  border-width: 5px;

  transition: all 0.4s ease-in-out;
}

.volet {
  flex-grow: 1;
  padding: 1rem;
  text-align: center;
}

.tranche {
  display: flex;
  justify-content: center;
  align-items: center;
  writing-mode: vertical-lr;
  min-height: 10em;
  line-height: 2em;
}

.volet .toggle:hover {
  background-color: rgba(255, 255, 255, 1);
  color: firebrick;
  box-shadow: 0 5px 15px rgba(145, 92, 182, 0.4);
}

.tranche:hover {
  color: rgba(255, 255, 255, 1);
  box-shadow: 0 5px 15px rgba(145, 92, 182, 0.4);
}

.txt_link {
  color: blueviolet;
  background-color: rgb(240, 229, 229);
}

.txt_link:hover {
  background-color: rgb(153, 182, 182);
  text-decoration: underline;
  font-style: bold;
  cursor: pointer;
}
</style>
