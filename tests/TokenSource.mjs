import { limit, preserve, read, transform } from "../src/parsers.mjs"
import { InputStream, Token, TokenSource } from "../src/types.mjs"

const ALP = [
	["Raph", "CAP"],
	["GHOUL", "rull"],
	["Side", "SNIDE"],
	["COUP", "HOOP"]
].map((x) => Token(...x))

// * 'TokenSource'
console.log(
	read(() => true, TokenSource({ type: "FINALE", value: "..." }))(InputStream(ALP))
)
console.log(
	read(
		(input) => input.curr().type !== "COUP",
		TokenSource({ type: "FINALE", value: "..." })
	)(InputStream(ALP))
)

console.log()
// * 'transform' and 'preserve'
console.log(transform()(InputStream(ALP)))
console.log(transform(preserve)(InputStream(ALP)))
console.log(transform((input, i) => [i % 2 ? input.curr() : 0])(InputStream(ALP)))

console.log()

console.log(limit(1, (input) => !input.curr().type.includes("C"))(InputStream(ALP)))
const i = InputStream(ALP)
console.log(limit((input) => !input.curr().type.includes("S"))(i))
console.log()

// * 'InputStream.copy'
console.log(i)
console.log(i.copy())
console.log(i.copy() === i)