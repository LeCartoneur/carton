<template>
  <div class="container">
    <textarea rows="10" cols="30" spellcheck="true" v-model="edit_txt" />
    <button @click="updateTxt">Save</button>
  </div>
</template>

<script>
export default {
  props: {
    parent_id: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    raw_txt: {
      type: String,
      default: '',
    },
    sous_cartons: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      edit_txt: this.fmtTxtDb2Edit(this.raw_txt),
    }
  },
  methods: {
    fmtTxtDb2Edit() {
      let fmt_txt = []
      if (this.raw_txt) {
        const regex = /{([^}]+)}\(([^}]+)\)/g
        let res,
          start_index = 0
        while ((res = regex.exec(this.raw_txt)) !== null) {
          if (start_index !== res.index) {
            fmt_txt.push(this.raw_txt.slice(start_index, res.index))
          }
          fmt_txt.push(
            `{${this.sous_cartons.find((carton) => carton._id === res[1]).nom}}(${res[2]})`
          )
          start_index = regex.lastIndex
        }
        if (start_index !== this.raw_txt.length) {
          fmt_txt.push(this.raw_txt.slice(start_index, this.raw_txt.length))
        }
      }
      return fmt_txt.join('')
    },
    fmtTxtEdit2Db() {
      let fmt_txt = []
      if (this.edit_txt) {
        const regex = /{([^}]+)}\(([^}]+)\)/g
        let res,
          start_index = 0
        while ((res = regex.exec(this.edit_txt)) !== null) {
          if (start_index !== res.index) {
            fmt_txt.push(this.edit_txt.slice(start_index, res.index))
          }
          fmt_txt.push(
            `{${this.sous_cartons.find((carton) => carton.nom === res[1])._id}}(${res[2]})`
          )
          start_index = regex.lastIndex
        }
        if (start_index !== this.edit_txt.length) {
          fmt_txt.push(this.edit_txt.slice(start_index, this.edit_txt.length))
        }
      }
      return fmt_txt.join('')
    },
    updateTxt() {
      fetch('https://api.carton.combiendecarbone.fr/cartons/update/text', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          id: this.parent_id,
          version: '0',
          cat: this.category,
          txt: this.fmtTxtEdit2Db(),
        }),
      }).then((response) => {
        if (response.status === 200) {
          this.$emit('reload')
        }
      })
    },
  },
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.container textarea {
  margin: 1rem;
}
</style>
