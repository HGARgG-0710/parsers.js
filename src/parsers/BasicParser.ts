import type { BasicStream } from "../types.js"
import type { ParserMap } from "./ParserMap.js"

// * note: doesn't do iteration - leaves it to the user...
export function BasicParser<KeyType = any, OutType = any>(
	parser: ParserMap<KeyType, OutType[]>
) {
	return function (input: BasicStream, init: Pushable = []) {
		const result = init
		while (!input.isEnd()) result.push(...parser(input))
		return result
	}
}
