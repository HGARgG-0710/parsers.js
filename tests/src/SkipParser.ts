import { BasicDynamicMap, InputStream, type Indexed } from "../../dist/src/types.js"
import { SkipParser, type ParserFunction } from "../../dist/src/parsers.js"
import { current, output, skipArg } from "../../dist/src/aliases.js"

import { function as _f } from "@hgargg-0710/one"
const { trivialCompose } = _f

const parserMap = BasicDynamicMap(
	new Map([
		[
			"S",
			function (input) {
				input.next()
				const toSkip = Number(input.next())
				return [toSkip, []]
			}
		]
	] as [string, ParserFunction][]),
	skipArg(1)(trivialCompose(output, current))
)

const skipParser = SkipParser(parserMap)

console.log(skipParser(InputStream("S3SieegbS2rau!" as unknown as Indexed<string>)))
console.log(
	skipParser(
		InputStream("LOLOLOLOLOLAAAAAAAAAAAAARRRGGHHS2" as unknown as Indexed<string>)
	)
)
