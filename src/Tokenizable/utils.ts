import type { SummatFunction } from "@hgargg-0710/summat.ts"

import { inplace, array, number } from "@hgargg-0710/one"
const { first } = array
const { insert, mutate } = inplace
const { makeOdd, isOdd } = number

export function matchString(value: string, key: RegExp | string): string[] {
	return mutate([...value.matchAll(key as RegExp)] as string[][], first)
}

export function tokenizeString<OutType = any>(
	string: string,
	key: RegExp | string,
	handler: SummatFunction<any, any, OutType>
): [string[], string[], (string | OutType)[]] {
	const matched = matchString(string, key)
	const split = string.split(key)
	const tokenized = matchedStringTokenizer(matched, split, handler)
	return [matched, split, tokenized]
}

export const matchedStringTokenizer = tokenizeMatched<string>((x) => !x.length)

export function tokenizeMatched<InType = any>(isEmpty: (x: InType) => boolean) {
	return function <OutType = any>(
		matched: InType[],
		split: InType[],
		handler: SummatFunction<any, InType, OutType>
	): (OutType | InType)[] {
		return matched
			.reduce(
				(acc: (OutType | InType)[], curr, i) =>
					insert(acc, makeOdd(i), handler(curr)),
				split
			)
			.filter((x, i: number) => isOdd(i) || !isEmpty(x as InType))
	}
}
