import { BasicDynamicMap, InputStream, type Indexed } from "../../dist/src/types.js"
import { SkipParser, preserve, type ParserFunction } from "../../dist/src/parsers.js"

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
	(input) => [1, [input.curr()]]
)

const skipParser = SkipParser(parserMap)

console.log(skipParser(InputStream("S3SieegbS2rau!" as unknown as Indexed<string>)))
console.log(
	skipParser(
		InputStream("LOLOLOLOLOLAAAAAAAAAAAAARRRGGHHS2" as unknown as Indexed<string>)
	)
)
