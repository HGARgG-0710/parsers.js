import type { SummatFunction } from "@hgargg-0710/summat.ts"
import type { TokenizationResult } from "./interfaces.js"

import { inplace, array, number, string } from "@hgargg-0710/one"
const { first } = array
const { insert, mutate } = inplace
const { makeOdd, isOdd } = number
const { isEmpty } = string

/**
 * Returns the array of all the values matched within `source` using `key`
 */
export function matchString(source: string, key: RegExp | string): string[] {
	return mutate([...source.matchAll(key as RegExp)] as string[][], first)
}

/**
 * Returns the triple of `[matched, split, tokenized]`, where:
 *
 * 1. `matched` is the result of `matchString(source, key)`
 * 2. `split` is the result of `source.split(key)`
 * 3. `tokenized` is the result of `matchedStringTokenizer(matched, split, handler)`
 */
export function tokenizeString<OutType = any>(
	source: string,
	key: RegExp | string,
	handler: SummatFunction<any, any, OutType>
): [string[], string[], (string | OutType)[]] {
	const matched = matchString(source, key)
	const split = source.split(key)
	const tokenized = matchedStringTokenizer(matched, split, handler)
	return [matched, split, tokenized]
}

/**
 * Equals `tokenizedMatched<string>((x: string) => !x.length)`
 */
export const matchedStringTokenizer = tokenizeMatched<string>(isEmpty)

/**
 * Returns a function that, based off the given `isEmpty` predicate
 * "fills" the gaps inside `matched` at odd positions using `handler(curr)`.
 * It then proceeds to `.filter`-out all the `isEmpty` elements from the final
 * `TokenizationResult`
 */
export function tokenizeMatched<InType = any>(isEmpty: (x: InType) => boolean) {
	return function <OutType = any>(
		matched: InType[],
		split: InType[],
		handler: SummatFunction<any, InType, OutType>
	): TokenizationResult<InType, OutType> {
		return matched
			.reduce(
				(acc: TokenizationResult<InType, OutType>, curr, i) =>
					insert(acc, makeOdd(i), handler(curr)),
				split
			)
			.filter((x, i: number) => isOdd(i) || !isEmpty(x as InType))
	}
}
