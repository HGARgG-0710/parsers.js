import type { SummatFunction } from "@hgargg-0710/summat.ts"

import type { Tokenizable, TokenizablePattern } from "./interfaces.js"
import { isFlushable, isPattern, isResulting, matchString } from "../utils.js"

import { inplace, object, typeof as type, function as _f } from "@hgargg-0710/one"
const { insert } = inplace
const { structCheck } = object
const { isFunction } = type
const { and } = _f

export function tokenizeString<OutType = any>(
	value: string,
	key: RegExp | string,
	handler: SummatFunction<any, string, OutType>
) {
	return matchString(value, key)
		.reduce((acc, curr, i) => insert(acc, 2 * i + 1, handler(curr)), value.split(key))
		.filter((x: any) => x.length)
}

export const isTokenizable = structCheck<Tokenizable>({ tokenize: isFunction })

export const isTokenizablePattern = and(
	isPattern,
	isTokenizable,
	isFlushable,
	isResulting
) as (x: any) => x is TokenizablePattern
