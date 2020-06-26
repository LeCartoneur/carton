/**
 * Return the regex for parsing a carton category
 * text.
 */
function getRegex() {
  return new RegExp(/{([^{}}]+)}\(([^())]+)\)/, 'g')
}

/**
 * Convert a text from database representation (references as {carton_id}(placeholder))
 * to the editor representation (references as {carton_name}(placeholder)).
 * @param {String} raw_txt Text to convert
 * @param {Array} sous_cartons Array of sous-cartons objects
 */
function fmtTxtDb2Edit(raw_txt, sous_cartons) {
  let fmt_txt = []
  if (raw_txt) {
    const regex = getRegex()
    let res,
      start_index = 0
    while ((res = regex.exec(raw_txt)) !== null) {
      if (start_index !== res.index) {
        fmt_txt.push(raw_txt.slice(start_index, res.index))
      }
      fmt_txt.push(`{${sous_cartons.find((carton) => carton._id === res[1]).nom}}(${res[2]})`)
      start_index = regex.lastIndex
    }
    if (start_index !== raw_txt.length) {
      fmt_txt.push(raw_txt.slice(start_index, raw_txt.length))
    }
  }
  return fmt_txt.join('')
}

/**
 * Convert a text from editor representation (references as {carton_name}(placeholder))
 * to the database representation (references as {carton_id}(placeholder)).
 * @param {String} edit_txt Text to convert
 * @param {Array} sous_cartons Array of sous-cartons objects
 */
function fmtTxtEdit2Db(edit_txt, sous_cartons) {
  let fmt_txt = []
  if (edit_txt) {
    const regex = getRegex()
    let res,
      start_index = 0
    while ((res = regex.exec(edit_txt)) !== null) {
      if (start_index !== res.index) {
        fmt_txt.push(edit_txt.slice(start_index, res.index))
      }
      fmt_txt.push(`{${sous_cartons.find((carton) => carton.nom === res[1])._id}}(${res[2]})`)
      start_index = regex.lastIndex
    }
    if (start_index !== edit_txt.length) {
      fmt_txt.push(edit_txt.slice(start_index, edit_txt.length))
    }
  }
  return fmt_txt.join('')
}

/**
 * Parse the text from the database (containing references as {carton_id}(placeholder))
 * and return an array of subtext objects with keys: the text to display (key: txt, string),
 * if it has to be treated as a link (key: interact, boolean) and if it's a link the id
 * of the corresponding carton (key: id, string).
 * @param {String} raw_txt Raw text from the database.
 */
function splitTxt(raw_txt) {
  let fmt_txt = []
  if (raw_txt) {
    const regex = getRegex()
    let res,
      start_index = 0
    while ((res = regex.exec(raw_txt)) !== null) {
      if (start_index !== res.index) {
        fmt_txt.push({
          txt: raw_txt.slice(start_index, res.index),
          interact: false,
        })
      }
      fmt_txt.push({
        txt: res[2],
        // TODO By default res[2] should not be empty (enforced by the editor validation process)
        //txt: res[2] ? res[2] : this.sous_cartons.find((carton) => carton._id === res[1]).nom,
        interact: true,
        id: res[1],
      })
      start_index = regex.lastIndex
    }
    if (start_index !== raw_txt.length) {
      fmt_txt.push({
        txt: raw_txt.slice(start_index, raw_txt.length),
        interact: false,
      })
    }
  }
  return fmt_txt
}

module.exports = { fmtTxtDb2Edit, fmtTxtEdit2Db, splitTxt, getRegex }
