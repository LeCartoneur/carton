<template>
  <p>
    <span
      v-for="txt in fmt_txt"
      :key="txt.txt"
      @click="callbackSousCartonText(txt)"
      :class="{ txt_link: txt.interact }"
      >{{ txt.txt }}</span
    >
  </p>
</template>

<script>
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
      let fmt_txt = []
      if (this.raw_txt) {
        const regex = /{([^}]+)}\(([^}]+)\)/g
        let res,
          start_index = 0
        while ((res = regex.exec(this.raw_txt)) !== null) {
          if (start_index !== res.index) {
            fmt_txt.push({
              txt: this.raw_txt.slice(start_index, res.index),
              interact: false,
            })
          }
          fmt_txt.push({
            txt: res[2] ? res[2] : this.sous_cartons.find((carton) => carton._id === res[1]).nom,
            interact: true,
            id: res[1],
          })
          start_index = regex.lastIndex
        }
        if (start_index !== this.raw_txt.length) {
          fmt_txt.push({
            txt: this.raw_txt.slice(start_index, this.raw_txt.length),
            interact: false,
          })
        }
      }
      return fmt_txt
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
