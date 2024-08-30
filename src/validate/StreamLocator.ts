import {
	DefineFinished,
	GeneralParser,
	type ParsingState
} from "../parsers/GeneralParser.js"
import type { ParserMap } from "../parsers/ParserMap.js"
import type { Position, PositionalStream } from "../types.js"

export type LocatorOutput = [boolean, Position]

export type LocatorState<KeyType = any> = ParsingState<
	PositionalStream,
	LocatorOutput,
	boolean,
	KeyType
>

export function streamLocatorFinished<KeyType = any>(this: LocatorState<KeyType>) {
	return this.streams[0].isEnd || this.result[0]
}

export function streamLocatorChange<KeyType = any>(
	this: LocatorState<KeyType>,
	currRes: boolean
) {
	this.result[0] = currRes
	this.result[1] = this.streams[0].pos
	if (!currRes) this.streams[0].next()
}

export function StreamLocator<KeyType = any>(
	locator: ParserMap<KeyType, boolean, LocatorState<KeyType>>
) {
	return GeneralParser<LocatorState<KeyType>>(
		DefineFinished<LocatorState<KeyType>>(
			{
				change: streamLocatorChange<KeyType>,
				parser: locator,
				result: [false, 0]
			},
			streamLocatorFinished
		)
	)
}
