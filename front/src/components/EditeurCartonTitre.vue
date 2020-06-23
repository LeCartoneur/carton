<template>
  <h1 class="nom">
    {{ title }}
    <span @click="updateTitle">✏️</span>
  </h1>
</template>

<script>
export default {
  props: {
    carton_nom: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      title: this.carton_nom,
    }
  },
  watch: {
    carton_nom() {
      this.title = this.carton_nom
    },
  },
  methods: {
    async updateTitle() {
      let msg = await this.confirmPrompt('Nouveau titre', this.carton_nom)
      if (msg !== '' && msg !== this.carton_nom) {
        this.$emit('update-ready', {
          operation: 'set',
          path: 'nom',
          value: msg,
        })
        this.title = msg
      }
    },
    /**
     * Wrapper to window.prompt to return a promise.
     * msg: String, message of the prompt.
     * default_msg, String, optional text to display
     */
    confirmPrompt(msg, default_msg = '') {
      return new Promise((resolve) => {
        let txt = window.prompt(msg, default_msg)
        resolve(txt)
      })
    },
  },
}
</script>

<style></style>
