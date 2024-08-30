import type { ParserMap } from "./ParserMap.js"
import { DefineFinished, GeneralParser, type ParsingState } from "./GeneralParser.js"
import { ArrayCollection, type Collection } from "../types/Collection.js"
import type { Position } from "src/types/Stream/Position.js"
import { skip } from "./utils.js"
import { firstFinished } from "./GeneralParser.js"
import type { ReversibleStream } from "main.js"

export type FixedSkipState<KeyType = any, OutType = any> = ParsingState<
	ReversibleStream,
	Collection,
	Iterable<OutType>,
	KeyType
>

export function fixedParserChange(n: Position) {
	const fixedSkip = skip(n)
	return function <KeyType = any, OutType = any>(
		this: FixedSkipState<KeyType, OutType>,
		temp: Iterable<OutType>
	) {
		this.result.push(...temp)
		fixedSkip(this.streams[0])
	}
}

export function FixedSkipParser(n: Position) {
	const fixedChange = fixedParserChange(n)
	return <KeyType = any, OutType = any>(
		parser: ParserMap<KeyType, Iterable<OutType>, FixedSkipState<KeyType, OutType>>
	) =>
		GeneralParser<FixedSkipState<KeyType, OutType>>(
			DefineFinished(
				{
					change: fixedChange<KeyType, OutType>,
					parser,
					result: ArrayCollection()
				},
				firstFinished<FixedSkipState<KeyType, OutType>>
			)
		)
}

export const StreamParser = FixedSkipParser(1)
