import {
	TokenType,
	TokenInstance,
	ArrayToken,
	RecursiveArrayToken,
	TokenMap,
	BasicMap,
	ValueMap,
	Token,
	TypeMap,
	PredicateMap
} from "../../../dist/src/types.js"

// * 'TokenType'

const Chalk = TokenType("chalk")
const ANOTHER = TokenType("SEVENTEENSEVENTEEN")

console.log(Chalk.is(Chalk(1717)))
console.log(Chalk.is(19))
console.log(Chalk.is(null))
console.log(Chalk.is({}))
console.log(Chalk.is(ANOTHER("999")))

console.log(Chalk(23))

console.log()

const [Izzy, Gherman] = ["izzy", "gherman"].map(TokenInstance)

console.log(Izzy.is(Izzy()))
console.log(Gherman.is(Gherman()))
console.log(Izzy.is(Gherman()))
console.log(Gherman.is(Izzy()))
console.log(Izzy() === Izzy())
console.log(Izzy())
console.log(Gherman())
console.log()

console.log(ArrayToken(Chalk("SEN")))
console.log(RecursiveArrayToken(Chalk([Chalk("???"), Chalk([Chalk("LAFAFAFAEAT????")])])))
console.log()

const tokenMap = TokenMap(BasicMap)(
	new Map([
		["izzy", () => console.log("Hula!")],
		["gherman", () => console.log("Quoi?")],
		["izzy", () => console.log("?????")]
	])
)

const valueMap = ValueMap(BasicMap)(
	new Map([
		["Kar", () => console.log("SSSPEEEELLi!")],
		["Mar", () => console.log("Excuse me, could you repeat that again please?")],
		["Kar", () => console.log("I'll be skipped")]
	])
)

const typeMap = TypeMap(PredicateMap)(
	new Map([
		[Izzy, () => console.log("here we go again...")],
		[
			Gherman,
			() => console.log("I'm a rambler, I'm a gambler, I'm a long way from home!")
		]
	])
)

tokenMap.index(Gherman())()
tokenMap.index(Izzy())()
tokenMap.index(Gherman())()
tokenMap.index(Gherman())()
console.log()

valueMap.index(Token("??/", "Kar"))()
valueMap.index(Token("?", "Mar"))()
valueMap.index(Token("??/", "Kar"))()
console.log()

typeMap.index(Gherman())()
typeMap.index(Izzy())()
console.log()
