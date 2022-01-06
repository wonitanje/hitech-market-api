String.prototype.capitalize = function () {
  return this.replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase())
}

export default String