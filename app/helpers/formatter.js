const getNumbersOnly = (x) => {
  return x.replace( /^\D+/g, '')
}

const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

// getAllMethodNames(obj) {
//   let methods = new Set();
//   while (obj = Reflect.getPrototypeOf(obj)) {
//     let keys = Reflect.ownKeys(obj)
//     keys.forEach((k) => methods.add(k));
//   }
//   return methods;
// }


module.exports = {
  getNumbersOnly:getNumbersOnly,
  numberWithCommas:numberWithCommas
}
