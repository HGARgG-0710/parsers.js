import { LayeredParser } from "../../dist/src/parsers.js"

const lp = LayeredParser([(x) => x ** 3, (x) => x + 3342, (x) => x || 3])
console.log(lp(880))
console.log(lp(0))

lp.layers = [(x) => String(x), (x) => x + 48]
console.log(lp("77"))
console.log(lp("ARRRRGGGHHH!"))
console.log(lp(0))

console.log(lp)
console.log(lp.layers.map((x) => x.toString()))

const lp2 = LayeredParser([(x) => x === 77])
console.log(lp2.layers.toString())
console.log(lp.layers.toString())

console.log(lp2(77))
console.log(lp2("21"))