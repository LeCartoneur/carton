<template>
  <!-- eslint-disable max-len-->
  <div style="width: 100%;">
    <h4>Texte explicatif</h4>
    <textarea
      rows="15"
      cols="50"
      spellcheck="true"
      :value="value"
      @input="update"
      class="editor-textarea"
    />
    <p class="error" v-if="refs_no_cartons.length > 0">
      Les références {{ refs_no_cartons.join(', ') }} n'ont pas de cartons qui leur font réference.
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
  <!-- eslint-enable max-len -->
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
    /**
     * Emit 'input' event with texte area text value for the v-model.
     * Also performs sous-carton autocomplete based on user's input.
     */
    update(e) {
      this.$emit('input', e.target.value)
      this.txt = e.target.value
      this.autocomplete.cursor = e.target.selectionStart
      this.autocomplete.previous = this.findPreviousBracket(this.txt, this.autocomplete.cursor)
      this.autocomplete.next = this.findNextBracket(this.txt, this.autocomplete.cursor)

      this.suggested_items = []
      if (this.autocomplete.previous > -1) {
        let txt_to_complete = this.txt.slice(
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
    /**
     * Find the position of the first previous opening curly bracket '{'.
     * Return -1 if a closing curly bracket '}' is found before.
     */
    findPreviousBracket(str, cursor) {
      let position = cursor - 1
      while (str[position] !== '{' && position > -1) {
        if (str[position] === '}') return -1
        position--
      }
      return position
    },
    /**
     * Find the position of the first next closing curly bracket '}'.
     * Return -1 if an opening curly bracket '{' is found before.
     */
    findNextBracket(str, cursor) {
      let position = cursor
      while (str[position] !== '}' && position < str.length) {
        if (str[position] === '{') return -1
        position++
      }
      return position === str.length ? -1 : position
    },
    /**
     * Callback when a suggestion is clicked by the user.
     * Replace the content of the {} with the name of the chosen sous-carton.
     * If inserting a new ref (no closing }) alors insert the placeholder in
     * parenthesis.
     */
    replace(item) {
      // Replace text
      let start = this.autocomplete.previous
      let end
      let txt = item.val
      if (this.autocomplete.next === -1) {
        txt += '}(placeholder) '
        end = this.autocomplete.cursor
      } else {
        end = this.autocomplete.next
      }
      let str = this.txt.slice(0, start + 1) + txt + this.txt.slice(end, this.txt.length)
      this.$emit('input', str)

      // Add any sous-carton
      if (!item.existing) {
        this.$emit('add-sous-carton', item.val.trim())
      }

      // Clean suggestions
      this.suggested_items = []
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

textarea.editor-textarea {
  width: 100%;
  margin: auto;
  padding: 12px 20px;
  box-sizing: border-box;
  border: 2px solid #ccc;
  border-radius: 4px;
  background-color: #f8f8f8;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
</style>
