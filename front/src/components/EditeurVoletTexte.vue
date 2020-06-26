<template>
  <div>
    <h4>Texte du carton</h4>
    <textarea
      rows="10"
      cols="30"
      spellcheck="true"
      style="resize: vertical;"
      :value="value"
      @input="update"
    />
    <p class="error" v-if="refs_no_cartons.length > 0">
      Les références {{ refs_no_cartons.join(', ') }} n'ont pas de cartons qui leur font référence.
    </p>
    <div class="popup" v-if="suggested_items.length > 0">
      <ul class="suggestions-list">
        <li
          v-for="item in suggested_items"
          :key="item.val"
          class="suggestion-item"
          @click="replace(item)"
        >
          {{ `${item.existing ? '' : 'Ajouter: '}${item.val}` }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Fuse from 'fuse.js'

export default {
  props: {
    value: {
      type: String,
      default: '',
    },
    sous_cartons_noms: {
      type: Array,
      default: () => [],
    },
    refs_no_cartons: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      suggested_items: [],
      autocomplete: {
        previous: -1,
        cursor: -1,
        next: -1,
      },
      txt: '',
    }
  },
  computed: {
    fuse() {
      return new Fuse(this.sous_cartons_noms, { includeScore: true })
    },
  },
  methods: {
    update(e) {
      this.$emit('input', e.target.value)
      this.txt = e.target.value
      this.autocomplete.cursor = e.target.selectionStart
      this.autocomplete.previous = this.findPreviousBracket(
        e.target.value,
        this.autocomplete.cursor
      )
      this.autocomplete.next = this.findNextBracket(e.target.value, this.autocomplete.cursor)

      this.suggested_items = []
      if (this.autocomplete.previous > -1) {
        let txt_to_complete = e.target.value.slice(
          this.autocomplete.previous + 1,
          this.autocomplete.cursor
        )
        this.fuse.search(txt_to_complete).forEach((item) => {
          if (item.score < 0.5) this.suggested_items.push({ val: item.item, existing: true })
        })
        if (
          this.suggested_items.findIndex((item) => item.val.toLowerCase() === txt_to_complete) ===
          -1
        ) {
          this.suggested_items.push({ val: txt_to_complete, existing: false })
        }
      }
    },
    findPreviousBracket(str, cursor) {
      let position = cursor
      while (str[position] !== '{' && position > -1) {
        if (str[position] === '}') return -1
        position--
      }
      return position
    },
    findNextBracket(str, cursor) {
      let position = cursor
      while (str[position] !== '}' && position < str.length) {
        if (str[position] === '{') return -1
        position++
      }
      return position === str.length ? -1 : position
    },
    replace(item) {
      let start = this.autocomplete.previous
      let end
      let txt = item.val
      if (this.autocomplete.next === -1) {
        txt += '}() '
        end = this.autocomplete.cursor
      } else {
        end = this.autocomplete.next
      }
      let str = this.txt.slice(0, start + 1) + txt + this.txt.slice(end, this.txt.length)
      this.$emit('input', str)

      if (!item.existing) {
        this.$emit('add-sous-carton', item.val.trim())
      }
    },
  },
}
</script>

<style scoped>
.error {
  color: red;
  font-style: italic;
}
.popup {
  padding: 1rem 5rem;
  background-color: rgb(255, 197, 197);
  /* position: absolute;
  z-index: 5; */
}

ul.suggestions-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.suggestion-item:hover {
  background-color: rgb(154, 154, 255);
}
</style>
