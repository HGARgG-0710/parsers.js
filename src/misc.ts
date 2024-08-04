import type { BasicStream } from "./types/Stream.js"
import type { HasType } from "./types/IndexMap.js"
import type { DelimPredicate } from "./parsers/ParserMap.js"

export const isHex = (x: string) => /[0-9A-Fa-f]/.test(x)
export const isNumber = (x: any): x is number | Number =>
	typeof x === "number" || x instanceof Number
export const isFunction = (x: any): x is Function => typeof x === "function"
export const isArray = (x: any): x is any[] => x instanceof Array

export const predicateChoice = (x: number | DelimPredicate): DelimPredicate =>
	isNumber(x)
		? (_input: BasicStream, i: number, j: number = 0) => i + j < (x as number)
		: x

export const setPredicate = (set: HasType) => (x: any) => set.has(x)
