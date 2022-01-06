Object.prototype.popKey = function (key) {
  const res = this[key]
  delete this[key]
  return res
}

Object.prototype.entriesArray = (object) => Array.from(Object.entries(object))

export default Object