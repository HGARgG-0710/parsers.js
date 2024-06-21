import type { Summat } from "../types.js"
import type { DynamicMap } from "../types/DynamicMap.js"
import type { IndexMap } from "../types/IndexMap.js"
import type { Stream } from "../types/Stream.js"
import { isFunction } from "../misc.js"

export type ParserMap<KeyType = any, OutType = any> =
	| IndexMap<KeyType, ParserFunction<OutType>>
	| DynamicMap<KeyType, ParserFunction<OutType>>

export interface ParserFunction<OutType = any> extends Summat {
	(input?: Stream, parser?: TableParser | ParserMap): OutType
}

export interface Handler<Type = any[]> extends Summat {
	(input?: Stream, i?: number): Type
}

export interface DelimHandler<Type = any[]> extends Summat {
	(input?: Stream, i?: number, j?: number): Type
}

export type TableParser<OutType = any> = ((input?: Stream) => OutType) & Summat

export function TableParser<KeyType = any, OutType = any>(
	parserMap: ParserMap<KeyType, OutType>,
	next?: TableParser<OutType>
): TableParser<OutType> {
	const parser: TableParser<OutType> = (input: Stream) =>
		parserMap.index(input.curr())(input, next || parser)
	return parser
}

export type ParsingPredicate = Handler<boolean>
export type DelimPredicate = DelimHandler<boolean>

export function isDynamic<KeyType = any, OutType = any>(
	x: ParserMap<KeyType, OutType>
): x is DynamicMap<KeyType, ParserFunction<OutType>> {
	return !isFunction(x.keys) && !isFunction(x.values)
}

export function table<KeyType = any, OutType = any>(
	parserMap: ParserMap<KeyType, OutType>
): [KeyType[], ParserFunction<OutType>[]] {
	if (isDynamic<KeyType, OutType>(parserMap)) return [parserMap.keys, parserMap.values]
	return [parserMap.keys(), parserMap.values()]
}
