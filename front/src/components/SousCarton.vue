<template>
  <div class="sous-carton">
    <h3 @click="changeCarton">{{ data.nom }}</h3>
    <p class="description">
      {{ data.versions[0].fonction.texte }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  methods: {
    changeCarton() {
      this.$emit('change-carton', this.data._id)
    },
  },
}
</script>

<style>
.sous-carton {
  border: 1px solid rgb(158, 158, 158);
  border-radius: 10px;
  padding: 2px;
  margin: 10px 0px;
}
.sous-carton h3 {
  margin: 5px auto 7px;
}
.sous-carton h3:hover {
  text-decoration: underline dotted;
}

.description {
  margin-top: 0;
  color: red;
}
</style>
