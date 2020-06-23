<template>
  <!-- TODO: prevoir une fct pour quand on clique sur le bouton déjà activé (animation) -->
  <button :class="style_class" @click="activate()">
    {{ name.charAt(0).toUpperCase() }}
  </button>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    clickable: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    style_class() {
      return {
        'left-tool-button': true,
        clickable: this.clickable && !this.active,
        active: this.active,
        unclickable: !this.clickable,
      }
    },
  },
  methods: {
    activate() {
      if (!this.active) {
        this.$emit('button-click')
      }
    },
  },
}
</script>

<style scoped>
@media (min-width: 700px) {
  .left-tool-button {
    font-size: 34px;
    width: 30%;
    border-width: 2px;
    margin-right: 7px;
  }
}

@media (max-width: 700px) {
  .left-tool-button {
    font-size: 20px;
    border-width: 2px;
    width: 30%;
  }
}

/*Pointeur*/
@media (min-width: 700px) {
  .left-tool-button {
    cursor: pointer;
  }

  .active {
    cursor: unset;
  }

  .unclickable {
    cursor: unset;
  }
}

/*Tactile
@media (max-width: 700px) {

}*/

.left-tool-button {
  border-style: solid;
  border-radius: 50%;
  color: inherit;
  background-color: inherit;
}

.active {
  font-weight: bold;
  border-width: 6px;
}

.unclickable {
  background-color: grey;
}

.clickable:hover {
  color: white;
}

#visionneuse {
  border-color: cyan;
  color: cyan;
}
#visionneuse:hover.clickable:hover {
  background-color: #00ffff3b;
}

#editeuse {
  border-color: chartreuse;
  color: chartreuse;
}
#editeuse:hover.clickable:hover {
  background-color: #7fff004a;
}

#commenteuse {
  border-color: gold;
  color: gold;
}
#commenteuse:hover.clickable:hover {
  background-color: #ffd7004f;
}
</style>
