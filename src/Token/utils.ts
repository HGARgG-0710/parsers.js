import type { type as types } from "@hgargg-0710/one"
import type { Token, TokenInstance } from "./interfaces.js"

import { type as _type, object } from "@hgargg-0710/one"
const { isObject } = _type
const { structCheck } = object

export function isType<Type = any>(type: Type): types.TypePredicate<TokenInstance<Type>> {
	return (x: any): x is TokenInstance<Type> =>
		x && isObject<TokenInstance<Type>>(x) && x.type === type
}

export const isToken = structCheck<Token>(["type", "value"])
export const type = <Type = any>(x: TokenInstance<Type>) => x.type
