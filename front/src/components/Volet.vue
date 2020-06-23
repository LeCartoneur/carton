<template>
  <div v-if="!reduced" :style="volet" class="volet">
    <div v-if="can_reduce" class="toggle" @click="toggleVolet">-</div>
    <h2>
      {{ config.titre }}
    </h2>

    <editeur-volet
      v-if="editor"
      :parent_id="parent_id"
      :category="category"
      :data="data"
      @reload="reload"
      style="grid-row: 2/4;"
      @update-ready="(updates) => sendUpdates(updates)"
    />

    <visionneuse-texte
      v-if="!editor"
      :raw_txt="data.texte"
      :sous_cartons="data.sous_cartons"
      class="volet-texte"
      @open-sous-carton="(id) => openSousCarton(id)"
      style="grid-row: 2;"
    />
    <visionneuse-sous-carton
      v-if="!editor && is_open_sous_carton"
      :carton="sous_carton"
      @change-carton="(id) => changeCarton(id)"
      style="grid-row: 4;"
    />
  </div>

  <div v-else :style="volet" class="tranche" @click="toggleVolet">
    <div class="toggle" @click="toggleVolet">+</div>
    <h2>{{ config.titre }}</h2>
  </div>
</template>

<script>
import VisionneuseSousCarton from './VisionneuseSousCarton.vue'
import VisionneuseTexte from './VisionneuseTexte.vue'
import EditeurVolet from './EditeurVolet.vue'

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
    VisionneuseSousCarton,
    VisionneuseTexte,
    EditeurVolet,
  },
  props: {
    category: {
      type: String,
      required: true,
    },
    data: {
      type: Object,
      default: () => {},
    },
    reduced: {
      type: Boolean,
      default: false,
    },
    parent_id: {
      type: String,
    },
    can_reduce: {
      type: Boolean,
      default: true,
    },
    editor: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      is_open_sous_carton: false,
      sous_carton: {},
    }
  },
  computed: {
    config() {
      return configs[this.category]
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
      this.is_open_sous_carton = false
      this.sous_carton = {}
    },
  },
  methods: {
    openSousCarton(id) {
      this.is_open_sous_carton = true
      this.sous_carton = this.data.sous_cartons.find((carton) => carton._id === id)
    },
    toggleVolet() {
      this.$emit('toggle-reduced')
    },
    changeCarton(carton_id) {
      this.$emit('change-carton', carton_id)
      this.sous_carton = {}
      this.is_open_sous_carton = false
    },
    reload() {
      this.$emit('reload')
    },
    sendUpdates(updates) {
      this.$emit('update-ready', updates)
    },
  },
}
</script>

<style scoped>
@media (max-width: 700px) {
  .toggle {
    visibility: hidden;
  }
}

@media (min-width: 700px) {
  .volet {
    flex-grow: 1;
    padding: 1rem;
    text-align: center;
    flex-basis: 33%;
    display: grid;
    grid-template-rows: 15% 30% auto 50%;
  }
}

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
.volet-texte {
  grid-row: 2;
}

.icon {
  display: inline-block;
  width: 23px;
  height: 23px;
}
</style>
