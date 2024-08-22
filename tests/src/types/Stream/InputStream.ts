import { InputStream } from "../../../../dist/src/types.js"

const is = InputStream("Come sun and come rain, we share shall the strain...")

console.log(is.isStart())
console.log(is.curr())
console.log(is.isStart())
console.log()

console.log(is.next())
console.log(is.isStart())
console.log()

console.log(is.next())
console.log(is.curr())
console.log(is.curr())
console.log(is.isStart())
console.log(is.prev())
console.log(is.curr())
console.log()

while (!is.isEnd()) console.log(`${is.pos} - "${is.next()}"`)

console.log(is.rewind())
console.log(is.next())
console.log(is.prev())
console.log(is.curr())
console.log()

is.next()
is.next()
is.next()
const is_copy = is.copy()
console.log(is.curr())
while (!is_copy.isEnd()) console.log(is_copy.next())
console.log()

console.log(is.curr())
console.log(is_copy.curr())
console.log(is.isEnd())
console.log(is_copy.isEnd())
console.log()

console.log(is.navigate(33))
console.log(is.navigate(243))
console.log(is.navigate(20))
console.log(is.navigate((input) => input.curr().charCodeAt() >= 116))
console.log()

console.log(is.pos)
console.log(is.curr())
is.rewind()

for (const x of is) console.log(x)
