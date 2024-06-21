import type { Stream } from "./types/Stream.js"
import type { HasType } from "./types/IndexMap.js"
import { TableParser } from "./parsers/TableParser.js"
import type { Summat } from "./types.js"

export type ParsingPredicate = (
	input?: Stream,
	i?: number,
	j?: number
) => boolean & Summat

export const isNumber = (x: any): x is number | Number =>
	typeof x === "number" || x instanceof Number
export const isFunction = (x: any): x is Function => typeof x === "function"
export const isArray = (x: any): x is any[] => x instanceof Array

export const predicateChoice = (x: number | Function): Function =>
	isNumber(x) ? (_input: Stream, i: number, j: number = 0) => i + j < (x as number) : x
export const parserChoice = (x: any): Function => (isFunction(x) ? x : TableParser(x))

export const setPredicate = (set: HasType) => (x: any) => set.has(x)
