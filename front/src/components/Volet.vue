<template>
  <div v-if="is_open_volet" :style="volet">
    <h2 @click="toggleVolet" :style="style">{{ config.titre }} -</h2>
    <p>
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ad molestiae veniam fugiat provident
      quo doloribus repudiandae non? Quia, et dolores. Deserunt ratione vero excepturi!
      Reprehenderit quae excepturi mollitia corporis earum!
    </p>
    <button @click="toggleSousCarton">{{ is_open_sous_carton ? 'Masquer' : 'Afficher' }}</button>
    <sous-carton v-if="is_open_sous_carton" />
  </div>
  <div v-else :style="volet">
    <h2 @click="toggleVolet" :style="style" class="tranche">+ {{ config.titre }}</h2>
  </div>
</template>

<script>
import SousCarton from './SousCarton.vue';

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
};

export default {
  components: {
    SousCarton,
  },
  props: ['type'],
  data() {
    return {
      is_open_volet: true,
      is_open_sous_carton: false,
      current_id_sous_carton: '',
    };
  },
  computed: {
    config() {
      return configs[this.type];
    },
    style() {
      return `background-color: ${this.config.color}`;
    },
    volet() {
      return `margin: 1rem;
  padding: 1rem;
  border: 1px solid ${this.config.color};`;
    },
  },
  methods: {
    toggleSousCarton() {
      this.is_open_sous_carton = !this.is_open_sous_carton;
    },
    toggleVolet() {
      this.is_open_volet = !this.is_open_volet;
    },
  },
};
</script>

<style>
.tranche {
  writing-mode: vertical-rl;
  text-orientation: mixed;
}
</style>
