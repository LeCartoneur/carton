function fmtTxtDb2Edit(raw_txt, sous_cartons) {
  let fmt_txt = []
  if (raw_txt) {
    const regex = /{([^}]+)}\(([^}]+)\)/g
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

function fmtTxtEdit2Db(edit_txt, sous_cartons) {
  let fmt_txt = []
  if (edit_txt) {
    const regex = /{([^}]+)}\(([^}]+)\)/g
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

module.exports = { fmtTxtDb2Edit, fmtTxtEdit2Db }
