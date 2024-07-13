import type { BasicStream } from "../types.js"
import type { Pushable } from "./StreamParser.js"
import type { ParserMap, ParsingPredicate } from "./ParserMap.js"
import { skip } from "./utils.js"

export type SkipType<Type> = [number | ParsingPredicate, Type]

export function SkipParser<KeyType = any, OutType = any>(
	parser: ParserMap<KeyType, SkipType<OutType[]>>
) {
	return function (input: BasicStream, initial: Pushable = []) {
		const finalResult = initial
		while (!input.isEnd()) {
			const [toSkip, currResult] = parser(input)
			finalResult.push(...currResult)
			skip(toSkip)(input)
		}
		return finalResult
	}
}
