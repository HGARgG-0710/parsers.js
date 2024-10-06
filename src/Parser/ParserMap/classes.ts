import type { BaseMapParsingState, DefaultMapParsingState } from "../interfaces.js"
import type { Indexable } from "src/IndexMap/interfaces.js"
import type { ParserMap, ParserFunction, StreamHandler, StreamMap } from "./interfaces.js"
import type { BasicStream } from "src/Stream/interfaces.js"

export function ParserMap<
	OutType = any,
	ParsingType extends BaseMapParsingState = DefaultMapParsingState
>(
	indexMap: Indexable<ParserFunction<ParsingType, OutType>>
): ParserMap<OutType, ParsingType> {
	const T = (x: ParsingType) => T.table.index(x)(x, T)
	T.table = indexMap
	return T
}

export function StreamMap<OutType = any>(
	indexMap: Indexable<StreamHandler<OutType>>
): StreamMap<OutType> {
	const T: StreamMap<OutType> = (x: BasicStream) => T.table.index(x)
	T.table = indexMap
	return T
}
