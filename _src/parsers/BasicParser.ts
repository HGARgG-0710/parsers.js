import type { ParserMap } from "./ParserMap.js"
import { DefineFinished, GeneralParser, type ParsingState } from "./GeneralParser.js"
import { ArrayCollection, type Collection } from "../types/Collection.js"
import { type BasicStream } from "../types/Stream/BasicStream.js"
import { firstFinished } from "./GeneralParser.js"

export type BasicState<KeyType = any, OutType = any> = ParsingState<
	BasicStream,
	Collection<OutType>,
	Iterable<OutType>,
	KeyType
>

export function basicParserChange<KeyType = any, OutType = any>(
	this: BasicState<KeyType, OutType>,
	x: Iterable<OutType>
) {
	this.result.push(...x)
}

// * note: doesn't do iteration - leaves it to the user...
export function BasicParser<KeyType = any, OutType = any>(
	parser: ParserMap<KeyType, Iterable<OutType>, BasicState<KeyType, OutType>>
) {
	return GeneralParser<BasicState<KeyType, OutType>>(
		DefineFinished(
			{
				parser,
				change: basicParserChange,
				result: ArrayCollection()
			},
			firstFinished<BasicState<KeyType>>
		)
	)
}
