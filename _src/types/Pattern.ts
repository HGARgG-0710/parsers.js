import type { Summat, SummatFunction } from "@hgargg-0710/summat.ts"
import { inplace, array } from "@hgargg-0710/one"

const { first } = array
const { mutate, insert } = inplace

export interface Pattern<Type = any> extends Summat {
	value: Type
}

export function matchString(value: string, key: RegExp | string): string[] {
	return mutate([...value.matchAll(key as RegExp)], first)
}

export function tokenizeString<OutType = any>(
	value: string,
	key: RegExp | string,
	handler: SummatFunction<any, string, OutType>
) {
	return matchString(value, key)
		.reduce((acc, curr, i) => insert(acc, 2 * i + 1, handler(curr)), value.split(key))
		.filter((x: any) => x.length)
}

export * from "./Pattern/TokenizablePattern.js"
export * from "./Pattern/ValidatablePattern.js"
export * from "./Pattern/EliminablePattern.js"
