import { BasicDynamicMap } from "../../../dist/src/types.js"

const dynamic = BasicDynamicMap(
	new Map([
		[4747, "29"],
		["SIEG!", "I the Urban Spaceman, baby! Here comes the twist... I-"]
	] as [number, string][]),
	"DON'T-EXIST!"
)

console.log(dynamic.index("SIEG!"))
console.log(dynamic.index(0))
dynamic.add(2, [0, 88])
console.log(dynamic.index(0))
dynamic.add(2, [0, "actually..."])
console.log(dynamic.index(0))

console.log(dynamic)

dynamic.default = "babababababababTURURRURRRUbababababababPOWPOWPOW"
console.log(dynamic.index(1))
