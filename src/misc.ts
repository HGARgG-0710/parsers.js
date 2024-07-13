import type { BasicStream } from "./types/Stream.js"
import type { HasType } from "./types/IndexMap.js"
import {
	TableParser,
	type DelimPredicate,
	type ParserMap
} from "./parsers/TableParser.js"

export const isNumber = (x: any): x is number | Number =>
	typeof x === "number" || x instanceof Number
export const isFunction = (x: any): x is Function => typeof x === "function"
export const isArray = (x: any): x is any[] => x instanceof Array

export const predicateChoice = (x: number | DelimPredicate): DelimPredicate =>
	isNumber(x) ? (_input: BasicStream, i: number, j: number = 0) => i + j < (x as number) : x
export function parserChoice<KeyType = any, OutType = any>(
	x: ParserMap<KeyType, OutType> | TableParser<OutType>
): TableParser<OutType> {
	return (isFunction as (x: any) => x is TableParser<OutType>)(x)
		? x
		: TableParser<any, OutType>(x)
}

export const setPredicate = (set: HasType) => (x: any) => set.has(x)
