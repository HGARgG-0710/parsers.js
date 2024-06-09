import { InputStream } from "../src/types.mjs"

const is = InputStream("Come sun and come rain, we share shall the strain...")
console.log(is.curr())
console.log(is.next())
console.log(is.next())
console.log(is.curr())
console.log(is.curr())
console.log(is.prev())
console.log(is.curr())

while (!is.isEnd()) console.log(is.next())
console.log(is.rewind())
console.log(is.next())
console.log(is.prev())
console.log(is.curr())
