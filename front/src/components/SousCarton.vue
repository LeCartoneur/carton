<template>
  <div class="sous-carton" @click="changeCarton">
    <h3>{{ data.nom }}</h3>
    <p class="description">{{ data.versions[0].fonction.texte }}</p>
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
  grid-row: 4;

  box-sizing: border-box;
  border: 8px inset rgb(121, 93, 44);
  background-color: rgb(165, 136, 85);

  padding: 2px;
  margin: 10px 0px;
}
.sous-carton h3 {
  margin: 5px auto 7px;
  color: blueviolet;
}

.sous-carton:hover {
  background-color: rgb(153, 182, 182);
  cursor: pointer;
}

.sous-carton h3:hover {
  text-decoration: underline;
  font-style: bold;
}

.description {
  margin-top: 0;
  color: white;
}
</style>
