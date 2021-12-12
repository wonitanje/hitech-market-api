String.prototype.capitalize = function () {
  return this.replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase())
}

module.exports = String