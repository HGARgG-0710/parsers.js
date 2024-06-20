import type { IndexMap } from "../types/IndexMap.js"
import type { ParserFunction } from "./TableParser.js"
import { parserChoice } from "../misc.js"
import type { Stream } from "../types/Stream.js"
import type { Summat } from "../types/Summat.js"

export interface Pushable extends Summat {
	push: (...x: any[]) => any
}

export function StreamParser<KeyType = any, OutType = any>(
	parserMap: IndexMap<KeyType, ParserFunction<OutType>>
) {
	const parser = parserChoice(parserMap)
	return function (input: Stream, initial: Pushable = []) {
		const final = initial
		while (!input.isEnd()) {
			final.push(...parser(input))
			input.next()
		}
		return final
	}
}
