<template>
  <div>
    <h4>Texte du carton</h4>
    <textarea
      rows="10"
      cols="30"
      spellcheck="true"
      style="resize: vertical;"
      :value="value"
      @input="update"
    />
    <p class="error" v-if="refs_no_cartons.length > 0">
      Les références {{ refs_no_cartons.join(', ') }} n'ont pas de cartons qui
      leur font référence.
    </p>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: '',
    },
    sous_cartons_noms: {
      type: Array,
      default: () => [],
    },
    refs_no_cartons: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    update(e) {
      this.$emit('input', e.target.value)
      /* let txt_area = e.target
      let cursor = txt_area.selectionStart === txt_area.selectionEnd ? txt_area.selectionStart : -1

      if (cursor > 0) {
      } */
    },
  },
}
</script>

<style scoped>
.error {
  color: red;
  font-style: italic;
}
</style>
