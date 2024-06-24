import { parserChoice } from "../misc.js"
import type { Stream } from "../types.js"
import type { Pushable } from "./StreamParser.js"
import type { ParserMap, TableParser, ParsingPredicate } from "./TableParser.js"
import { skip } from "./utils.js"

export type SkipType<Type> = [number | ParsingPredicate, Type]

export function SkipParser<KeyType = any, OutType = any>(
	parserMap: ParserMap<KeyType, SkipType<OutType[]>> | TableParser<SkipType<OutType[]>>
) {
	const parser = parserChoice<KeyType, SkipType<OutType[]>>(parserMap)
	return function (input: Stream, initial: Pushable = []) {
		const finalResult = initial
		while (!input.isEnd()) {
			const [toSkip, currResult] = parser(input)
			finalResult.push(...currResult)
			skip(toSkip)(input)
		}
		return finalResult
	}
}
