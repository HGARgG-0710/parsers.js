import type { SummatFunction } from "@hgargg-0710/summat.ts"

import { matchString } from "../utils.js"
import { inplace } from "@hgargg-0710/one"
const { insert } = inplace

export function tokenizeString<OutType = any>(
	string: string,
	key: RegExp | string,
	handler: SummatFunction<any, any, OutType>
): [string[], string[], (string | OutType)[]] {
	const matched = matchString(string, key)
	const split = string.split(key)
	const tokenized = tokenizeMatched(matched, split, handler)
	return [matched, split, tokenized]
}

export function tokenizeMatched<InTypes = any, OutType = any>(
	matched: any[],
	split: InTypes[],
	handler: SummatFunction<any, any, OutType>
): (OutType | InTypes)[] {
	return matched
		.reduce((acc, curr, i) => insert(acc, 2 * i + 1, handler(curr)), split)
		.filter((x: any) => x.length)
}
