import type { BaseMapParsingState, DefaultMapParsingState } from "../interfaces.js"
import type { IndexMap } from "src/IndexMap/interfaces.js"
import type { ParserMap, ParserFunction, StreamHandler, StreamMap } from "./interfaces.js"
import type { BasicStream } from "src/Stream/BasicStream/interfaces.js"

export function ParserMap<
	KeyType = any,
	OutType = any,
	ParsingType extends BaseMapParsingState<KeyType> = DefaultMapParsingState<KeyType>
>(
	indexMap: IndexMap<KeyType, ParserFunction<ParsingType, OutType>>
): ParserMap<KeyType, OutType, ParsingType> {
	const T = (x: ParsingType) => T.table.index(x)(x, T)
	T.table = indexMap
	return T
}

export function StreamMap<KeyType = any, OutType = any>(
	indexMap: IndexMap<KeyType, StreamHandler<OutType>>
): StreamMap<OutType> {
	const T: StreamMap<OutType> = (x: BasicStream) => T.table.index(x)
	T.table = indexMap
	return T
}
