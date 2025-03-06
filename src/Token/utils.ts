import type { type as types } from "@hgargg-0710/one"
import type { IToken, ITokenInstance } from "./interfaces.js"

import { TokenInstance, TokenType } from "./classes.js"

import { type as _type, object } from "@hgargg-0710/one"
import { fromEnum } from "../EnumSpace/utils.js"
const { isObject } = _type
const { structCheck } = object

export function isType<Type = any>(
	type: Type
): types.TypePredicate<ITokenInstance<Type>> {
	return (x: any): x is ITokenInstance<Type> =>
		x && isObject<ITokenInstance<Type>>(x) && x.type === type
}

export const isToken = structCheck<IToken>(["type", "value"])
export const type = <Type = any>(x: ITokenInstance<Type>) => x.type
export const typeSetter =
	<Type = any>(type: Type) =>
	(x: ITokenInstance<Type>) =>
		(x.type = type)

export const tokenInstances = fromEnum(TokenInstance)
export const tokenTypes = fromEnum(TokenType)
