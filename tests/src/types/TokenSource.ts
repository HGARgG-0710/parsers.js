import { type Handler, limit, read, transform } from "../../../dist/src/parsers.js"
import {
	InputStream,
	type Stream,
	Token,
	TokenSource,
	type Concattable
} from "../../../dist/src/types.js"

import { preserve } from "../../../dist/src/aliases.js"

const ALP = [
	["Raph", "CAP"],
	["GHOUL", "rull"],
	["Side", "SNIDE"],
	["COUP", "HOOP"]
].map((x) => Token(...(x as [string, string])))

// * 'TokenSource'
console.log(
	read(() => true)(
		InputStream(ALP),
		TokenSource({
			type: "FINALE",
			value: "..." as unknown as Concattable<any>
		}) as unknown as Concattable<Token<string, string>>
	)
)
console.log(
	read((input) => input?.curr().type !== "COUP")(
		InputStream(ALP),
		TokenSource({
			type: "FINALE",
			value: "..." as unknown as Concattable<any>
		}) as unknown as Concattable<Token<string, string>>
	)
)

console.log()
// * 'transform' and 'preserve'
console.log(transform()(InputStream(ALP)))
console.log(transform(preserve as Handler<any>)(InputStream(ALP)))
console.log(
	transform(((input: Stream, i: number) => [
		i % 2 ? input.curr() : 0
	]) as unknown as Handler<any>)(InputStream(ALP))
)

console.log()

console.log(limit(1, (input) => !input?.curr().type.includes("C"))(InputStream(ALP)))
const i = InputStream(ALP)
console.log(limit((input) => !input?.curr().type.includes("S"))(i))
console.log()

// * 'InputStream.copy'
console.log(i)
console.log(i.copy?.())
console.log(i.copy?.() === i)
