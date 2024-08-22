import type { BasicStream } from "src/types/Stream/BasicStream.js"
import type { Position } from "src/types/Stream/Position.js"
import type { ParserMap } from "./ParserMap.js"
import { skip } from "./utils.js"
import { GeneralParser } from "./GeneralParser.js"
import { ArrayCollection, type Collection } from "../types/Collection.js"
import { firstFinished } from "../aliases.js"

export type SkipType<Type> = [number | Position, Type]

export function SkipParser<KeyType = any, OutType = any>(
	parser: ParserMap<KeyType, SkipType<OutType[]>>
) {
	return GeneralParser<BasicStream, Collection, SkipType<OutType[]>>({
		parser,
		finished: firstFinished,
		result: ArrayCollection(),
		change: function (
			finalResult: Collection<OutType>,
			[toSkip, tempResult]: SkipType<OutType[]>
		) {
			finalResult.push(...tempResult)
			skip(toSkip)(this.streams[0])
		}
	})
}
