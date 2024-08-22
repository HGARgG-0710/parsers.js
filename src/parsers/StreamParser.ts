import type { ParserMap } from "./ParserMap.js"
import { GeneralParser } from "./GeneralParser.js"
import { ArrayCollection, type Collection } from "../types/Collection.js"
import type { BasicStream } from "src/types/Stream/BasicStream.js"
import type { Position } from "src/types/Stream/Position.js"
import { skip } from "./utils.js"
import { firstFinished } from "../aliases.js"

export function FixedSkipParser(n: Position) {
	const fixedSkip = skip(n)
	return <KeyType = any, OutType = any>(parser: ParserMap<KeyType, OutType[]>) =>
		GeneralParser<BasicStream, Collection, Iterable<any>>({
			finished: firstFinished,
			change: function (result, y: Collection<OutType>) {
				result.push(...y)
				fixedSkip(this.streams[0])
			},
			parser,
			result: ArrayCollection()
		})
}

export const StreamParser = FixedSkipParser(1)
