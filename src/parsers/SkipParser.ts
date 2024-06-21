import { parserChoice } from "../misc.js"
import type { IndexMap, Stream } from "../types.js"
import type { Pushable } from "./StreamParser.js"
import type { ParserFunction } from "./TableParser.js"
import { skip } from "./utils.js"

export function SkipParser<KeyType = any, OutType = any>(
	parserMap: IndexMap<KeyType, ParserFunction<[number | Function, OutType]>> | Function
) {
	const parser = parserChoice(parserMap)
	return function (input: Stream, initial: Pushable) {
		const finalResult = initial
		while (!input.isEnd()) {
			const [toSkip, currResult] = parser(input)
			finalResult.push(...currResult)
			skip(toSkip)(input)
		}
		return finalResult
	}
}
