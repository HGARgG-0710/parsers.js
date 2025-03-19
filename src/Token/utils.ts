import type { IToken, ITokenInstance, ITypeCheckable } from "./interfaces.js"

import { TokenInstance, TokenType } from "./classes.js"
import { fromEnum } from "../EnumSpace/utils.js"

import { type as _type, object, boolean, functional } from "@hgargg-0710/one"
const { structCheck, prop } = object
const { eqcurry } = boolean
const { trivialCompose } = functional

/**
 * Returns a type predicate that compares the `x.type` of the given `x` to `type`
 */
export function isType<Type = any>(
	_type: Type
): _type.TypePredicate<ITokenInstance<Type>> {
	return structCheck<ITokenInstance<Type>>({
		type: trivialCompose(eqcurry(_type), type)
	})
}

/**
 * Checks whether the given `x` is an `IToken`
 */
export const isToken = structCheck<IToken>(["type", "value"])

/**
 * Returns the value of the `x.type` for the given `ITokenInstance`
 */
export const type = prop("type") as <Type = any>(x: ITokenInstance<Type>) => Type

/**
 * Returns a function that sets the `.type` of the given `ITokenInstance` to `type`
 */
export const typeSetter =
	<Type = any>(type: Type) =>
	(x: ITokenInstance<Type>) =>
		(x.type = type)

/**
 * Creates an array of `TokenInstanceClass`es with `.type`s taken from the given `EnumSpace`
 */
export const tokenInstances = fromEnum(TokenInstance)

/**
 * Creates an array of `MarkedTokenType`s with the `.type`s taken from the given `EnumSpace`
 */
export const tokenTypes = fromEnum(TokenType)

/**
 * Returns the value of the `.is` property for the given `TypeCheckable`
 */
export const is = prop("is") as <Type = any>(
	t: ITypeCheckable<Type>
) => _type.TypePredicate<Type>
