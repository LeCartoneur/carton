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
  components: { Toolbouton},
  data() {
      return {
      buttons: [],
    }
  },
  props: {
    mode_actif: {
        type: Number,
        required: true,
        default: 0,
        },
  },
  methods: {
    select(selected) {
      if(selected.name !== this.buttons[this.mode_actif].name)
      {
        for(const [i, cur_butt] of this.buttons.entries()){
          if(cur_butt.active)
          {
            cur_butt.active = false;
          }
          else if(cur_butt.name === selected.name){
            this.$emit('mode-update', i);
          }
        }

        selected.active = true;
        
      }
    },
    createButtonList(){
        for (let name of ['visionneuse', 'editeuse', 'commenteuse']) {
            this.buttons.push({ name: name, active: false , clickable: true})
        }
        this.buttons[this.mode_actif].active = true;
    }
  },
  mounted() {
    this.createButtonList();
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
    top: 20px;

    width: 200px;
    height: 56px;

    padding-top: 4px;
    padding-bottom: 4px;
  }
}

@media (max-width: 700px) {
  .left-tools {
    left: 0;
    top: 2px;

    width: 115px;
    height: 50px;

    padding-right: 1px;
    padding-top: 1px;
    padding-bottom: 1px;
  }
}
</style>
