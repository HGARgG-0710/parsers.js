import type { ParserMap } from "./ParserMap.js"
import { GeneralParser } from "./GeneralParser.js"
import { ArrayCollection, type Collection } from "src/types/Collection.js"

export function FiniteStepParser(n: number) {
	return <KeyType = any, OutType = any>(parser: ParserMap<KeyType, OutType[]>) =>
		GeneralParser({
			finished: ({ streams }) => streams[0].isEnd(),
			change: function (result, y: Collection<OutType>) {
				result.push(...y)
				let i = 0
				const { 0: input } = this.streams
				while (i < n) {
					input.next()
					++i
				}
			},
			parser,
			result: ArrayCollection()
		})
}

export const StreamParser = FiniteStepParser(1)
