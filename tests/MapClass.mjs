import {
	PredicateMap,
	RegExpMap,
	SetMap,
	BasicMap,
	TokenMap,
	Token
} from "../src/types.mjs"

// * 'MapClass'
const pMap = PredicateMap(
	new Map([
		[(x) => x === 78, false],
		[(x) => typeof x === "number", 443],
		[(x) => typeof x === "string", true]
	])
)
const reMap = RegExpMap(
	new Map([
		[/889+/, 22],
		[/8?89/, 7],
		[/[A-T]/, " - Boo!\n - AAAAAAAAAAAAAH!"]
	])
)
const sMap = SetMap(
	new Map([
		[new Set([true, false, null]), 3939392],
		[new Set([77, 42]), 11],
		[new Set(["dog", "voice", "words"]), "bark"]
	])
)
const bMap = BasicMap(
	new Map([
		[2929, "K!"],
		[88, "X!"],
		["BOB!", "E!"],
		[true, "K-E-X! Kex!"]
	]),
	"I'm not even supposed to exist, you know!"
)

const btMap = TokenMap(BasicMap)(
	new Map([
		[
			"Art Vandalay",
			function () {
				console.log("BURP!")
			}
		],
		[
			"J.S.",
			function () {
				console.log(
					"The last thing a tour of which he is quialified to give is reality!"
				)
			}
		]
	])
)
const treMap = TokenMap(RegExpMap)(
	new Map([
		[/LaCarte?/, "_??"],
		[/FARGO*/, 77]
	])
)

;[pMap, reMap, sMap, bMap, btMap, treMap].forEach((x) => {
	console.log(x.keys())
	console.log(x.values())
	console.log()
})
;["SIEGBRAU!", 78, 229, -11 / 9].forEach((x) => console.log(pMap.index(x)))

console.log()
;["889", "ABERLy!", "89", "88999", "here comes the twist... i - don't exist!"].forEach(
	(x) => console.log(reMap.index(x))
)

console.log()
;[null, true, 42, "words"].forEach((x) => console.log(sMap.index(x)))

console.log()
;[2929, "BOB!", 88, true, "Quoi!"].forEach((x) => console.log(bMap.index(x)))

console.log()
;[
	["J.S.", 0],
	["Art Vandalay", 9]
].forEach((pair) => btMap.index(Token(...pair)))

console.log()
;[
	["LaCart", 0],
	["LaCarte", 1],
	["FARG", 9],
	["FARGOOOOOOOOOOOOOOOOOOOOOOOOOOOOO", 9]
].forEach((pair) => console.log(treMap.index(Token(...pair))))

console.log()

// * 'default' test:
console.log(bMap.default())
console.log(treMap.default())
