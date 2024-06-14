import { TokenType, TokenInstance } from "../src/types.mjs"

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
