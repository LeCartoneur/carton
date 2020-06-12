<template>
  <div>
    <h2>{{ data.nom }}</h2>
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
      required: true
    }
  }
};
</script>

<style>
.description {
  color: red;
}
</style>
