<template>
  <div class="left-tools">
    <Toolbouton
      v-for="button in buttons"
      :key="button.id"
      :id="button.name"
      :name="button.name"
      :clickable="button.clickable"
      :active="button.active"
      @button-click="select(button)"
    ></Toolbouton>
  </div>
</template>

<script>
import Toolbouton from './Toolbouton.vue'

export default {
  components: { Toolbouton },
  props: {
    mode_actif: {
      type: Number,
      required: true,
    },
  },
  computed: {
    buttons: {
      get() {
        let buttons = this.getButtons()
        buttons.forEach((button) => {
          button.active = button.id === this.mode_actif
        })
        return buttons
      },
      set(button_id) {
        this.$emit('mode-update', button_id)
      },
    },
  },
  methods: {
    select(selected) {
      this.buttons = this.buttons.findIndex((button) => button.id === selected.id)
    },
    getButtons() {
      return [
        { name: 'visionneuse', id: 0, active: true, clickable: true },
        { name: 'editeuse', id: 1, active: false, clickable: true },
        { name: 'commenteuse', id: 2, active: false, clickable: true },
      ]
    },
  },
}
</script>

<style>
.left-tools {
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-end;
  position: absolute;
  z-index: 1;
  background-color: #2c1d8a;
  border-top-right-radius: 30px;
  border-bottom-right-radius: 30px;
}

@media (min-width: 700px) {
  .left-tools {
    left: 0;
    top: calc(35px + 18px + 5px);

    width: 200px;
    height: 56px;

    padding-top: 4px;
    padding-bottom: 4px;
  }
}

@media (max-width: 700px) {
  .left-tools {
    left: 0;
    top: calc(35px + 18px + 5px);

    width: 115px;
    height: 50px;

    padding-right: 1px;
    padding-top: 1px;
    padding-bottom: 1px;
  }
}
</style>
