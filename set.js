var Set = require("collections/set");

var codes = new Set();

let t = Array(1,2,4,5,1,3)
let t1 = Array(1,2,4,25)

let tt = [...t, ...t1]
console.log([...new Set(tt)]);
