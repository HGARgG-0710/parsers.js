import type { Position } from "src/types/Stream/Position.js"
import type { ParserMap } from "./ParserMap.js"
import { skip } from "./utils.js"
import { DefineFinished, GeneralParser, type ParsingState } from "./GeneralParser.js"
import { ArrayCollection, type Collection } from "../types/Collection.js"
import { firstFinished } from "./GeneralParser.js"
import type { ReversibleStream } from "main.js"

export type SkipType<Type> = [Position, Type]

export type SkipState<KeyType = any, OutType = any> = ParsingState<
	ReversibleStream,
	Collection<OutType>,
	SkipType<Iterable<OutType>>,
	KeyType
>

export function skipParserChange<KeyType = any, OutType = any>(
	this: SkipState<KeyType, OutType>,
	[toSkip, tempResult]: SkipType<Iterable<OutType>>
) {
	this.result.push(...tempResult)
	skip(toSkip)(this.streams[0])
}

export function SkipParser<KeyType = any, OutType = any>(
	parser: ParserMap<KeyType, SkipType<Iterable<OutType>>, SkipState<KeyType, OutType>>
) {
	return GeneralParser<SkipState<KeyType, OutType>>(
		DefineFinished(
			{
				parser,
				result: ArrayCollection(),
				change: skipParserChange<KeyType, OutType>
			},
			firstFinished<SkipState<KeyType, OutType>>
		)
	)
}
