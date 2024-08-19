import { StringPattern } from "../../../dist/src/types.js"

console.log(StringPattern)
const sp = StringPattern(
	"I AM A PATTERN AND I AM A STRING! FROM GRIP MIGHTY O'MINE NO THING MAY YE GRIP!"
)
console.log(sp)
console.log(StringPattern.is(sp))
console.log(StringPattern.is("POTATO!"))
console.log(StringPattern.is(0))
console.log(sp.class)
console.log(sp.value)
console.log(sp.split(" ").join(StringPattern("7'oClock!")))
console.log("\n\n\n")
console.log(...sp.split(/I|A/))
console.log("\n\n\n")
console.log(...sp.matchAll(/S|I|A|(?:FROM)/g))
console.log()
