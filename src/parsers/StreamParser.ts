import type { ParserMap } from "./ParserMap.js"
import type { BasicStream } from "../types/Stream.js"

export function StreamParser<KeyType = any, OutType = any>(
	parser: ParserMap<KeyType, OutType[]>
) {
	return function (input: BasicStream, initial: Pushable = []) {
		const final = initial
		while (!input.isEnd()) {
			final.push(...parser(input))
			input.next()
		}
		return final
	}
}
