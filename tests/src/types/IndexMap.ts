import {
	PredicateMap,
	RegExpMap,
	SetMap,
	BasicMap,
	table
} from "../../../dist/src/types.js"

// * 'PredicateMap'
const pmTest = PredicateMap(
	new Map([
		[(x: any) => x === 49, "Tar"],
		[(x: any) => typeof x === "number", true],
		[(x: any) => x == 32, "Bar"],
		[(x: any) => ["Tar", "Bar", "Star"].includes(x), 444],
		[(x: any) => typeof x === "string", "Shablagoo!"]
	] as [any, any][]),
	911
)

console.log(pmTest.index(pmTest.index(49)))
console.log(pmTest.index(pmTest.index(32)))
console.log(pmTest.index(32))
console.log(pmTest.index("I DON'T EXIST!"))
console.log()

// * 'RegExpMap'
const remTest = RegExpMap(
	new Map([
		[/88?9+/, "I'M A JELLYFISH, I'MAJELLIFYSSHHHH!"],
		[/K?IN?G?(1|!)*/, "COOOPER"]
	]),
	"BUB"
)

console.log(remTest.index("889"))
console.log(remTest.index("8C9"))
console.log(remTest.index("8889"))
console.log(remTest.index("ARC88999999999999999999999999999999999"))
console.log(remTest.index("KING"))
console.log(remTest.index("KIN"))
console.log(remTest.index("IG"))
console.log(remTest.index("I"))
console.log()

// * 'table'
console.log(table(remTest))
console.log(table(pmTest))
console.log()

// * 'SetMap'
const smTest = SetMap(
	new Map([
		[new Set([990, 4432, "x"]), "BARBARBAR"],
		[new Set(), "I never happen."],
		[new Set(["baol"]), 9]
	] as [Set<any>, any][])
)

console.log(smTest.index(4432))
console.log(smTest.index(10))
console.log(smTest.index("baol"))
console.log(smTest.index("x"))
console.log()

// * 'BasicMap', '.add', '.delete', '.replace'
const bmTest = BasicMap(
	new Map([
		[441, "open"],
		[990, "cloased"]
	])
)

console.log(bmTest.index(441))
console.log(table(bmTest))
bmTest.add(0, [441, "IMFISTIMFIRSTIMFIRST!"])
console.log(table(bmTest))
console.log(bmTest.index(441))
bmTest.add(3, [
	"arc",
	"Where are your fears hidden, your guilt buried, your weapons folded?"
])
console.log(bmTest.index(990))
console.log(bmTest.index("arc"))
bmTest.delete(3)
console.log(bmTest.index("arc"))
bmTest.replace(1, [700, "???"])
console.log(table(bmTest))
console.log(bmTest.index(700))
console.log()

// * '.default'
console.log(remTest.default)
console.log(pmTest.default)
console.log(smTest.default)
