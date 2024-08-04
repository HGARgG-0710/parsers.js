import type { Position } from "../types.js"
import type { ParserMap, StreamPredicate } from "./ParserMap.js"
import { skip } from "./utils.js"
import { GeneralParser } from "./GeneralParser.js"
import { ArrayCollection, type Collection } from "src/types/Collection.js"
import { firstFinished } from "main.js"

export type SkipType<Type> = [number | StreamPredicate, Type]

export function SkipParser<KeyType = any, OutType = any>(
	parser: ParserMap<KeyType, SkipType<OutType[]>>
) {
	return GeneralParser({
		parser,
		finished: firstFinished,
		result: ArrayCollection(),
		change: function (
			finalResult: Collection<OutType>,
			toSkip: number | Position,
			tempResult: OutType[]
		) {
			finalResult.push(...tempResult)
			skip(toSkip)(this.streams[0])
		} as (result: Collection<OutType>, ...y: any[]) => void
	})
}
