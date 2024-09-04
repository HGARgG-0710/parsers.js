import type { SummatFunction } from "@hgargg-0710/summat.ts"
import { matchString } from "../utils.js"

import { inplace } from "@hgargg-0710/one"
const { insert } = inplace

export function tokenizeString<OutType = any>(
	value: string,
	key: RegExp | string,
	handler: SummatFunction<any, string, OutType>
) {
	return matchString(value, key)
		.reduce((acc, curr, i) => insert(acc, 2 * i + 1, handler(curr)), value.split(key))
		.filter((x: any) => x.length)
}
