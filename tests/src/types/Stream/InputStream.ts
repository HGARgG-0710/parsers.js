import { InputStream, type Indexed } from "../../../../dist/src/types.js"

const is = InputStream(
	"Come sun and come rain, we share shall the strain..." as unknown as Indexed<string>
)
console.log(is.curr())
console.log(is.next())
console.log(is.next())
console.log(is.curr())
console.log(is.curr())
console.log(is.prev?.())
console.log(is.curr())

while (!is.isEnd()) console.log(is.next())
console.log(is.rewind?.())
console.log(is.next())
console.log(is.prev?.())
console.log(is.curr())
