<template>
  <carton :carton_id="carton_id" />
</template>

<script>
import Carton from '../components/Carton.vue'
export default {
  components: {
    Carton,
  },
  props: {
    carton_id: {
      type: String,
      required: true,
    },
  },
}
</script>

<style></style>
