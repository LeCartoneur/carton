<template>
  <p class="visionneuse">
    <span
      v-for="txt in fmt_txt"
      :key="txt.txt"
      @click="callbackSousCartonText(txt)"
      :class="{ txt_link: txt.interact }"
    >
      {{ txt.txt }}
    </span>
  </p>
</template>

<script>
import { splitTxt } from '../plugins/formatTexte.js'

export default {
  props: {
    raw_txt: {
      type: String,
      default: '',
    },
    sous_cartons: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    fmt_txt() {
      return splitTxt(this.raw_txt)
    },
  },
  methods: {
    callbackSousCartonText(txt) {
      if (txt.interact) {
        this.$emit(
          'open-sous-carton',
          this.sous_cartons.find((carton) => carton._id === txt.id)._id
        )
      }
    },
  },
}
</script>

<style>
.visionneuse {
  white-space: pre-wrap;
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
