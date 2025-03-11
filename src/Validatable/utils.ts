import type { type } from "@hgargg-0710/one"
import type {
	FaultyElement,
	InvalidEntries,
	InvalidMatch,
	ValidationHandler,
	ValidationOutput,
	ValidMatch
} from "./interfaces.js"

import { validation } from "../constants.js"
import { isGoodIndex } from "src/utils.js"
import { tokenizeString } from "../Tokenizable/utils.js"

import { isPair } from "./refactor.js"

import { boolean, functional } from "@hgargg-0710/one"
const { T, eqcurry } = boolean
const { negate } = functional

const { ValidationPassed, ValidationFailed, FaultyElement, InvalidMatch, ValidMatch } =
	validation.ValidatablePattern

/**
 * Returns whether the given `x === ValidMatch`
 */
export const isValidMatch = eqcurry(ValidMatch) as (x: any) => x is ValidMatch

/**
 * Returns whether the given `x === InvalidMatch`
 */
export const isInvalidMatch = eqcurry(InvalidMatch) as (x: any) => x is InvalidMatch

/**
 * Returns `validateTokenized(matched, tokenized)` based off the result of `tokenizeString(source, key, handler)`
 */
export function validateString(
	source: string,
	key: string | RegExp,
	handler: ValidationHandler<string>
): ValidationOutput<string> {
	const [matched, , tokenized] = tokenizeString(source, key, handler)
	return validateTokenized(matched, tokenized)
}

/**
 * Checks `tokenized` for `InvalidMatch`es, replacing them with `FaultyElement`.
 *
 * Returns `ValidationPassed` of un-tokenized items on success, and
 * `ValidationFailed` with `InvalidMatch` indexes replaced by `FaultyElement`
 * on failure.
 */
export function validateTokenized<Type = any>(
	matched: Type[],
	tokenized: (Type | ValidMatch | InvalidMatch | FaultyElement<Type>)[]
): ValidationOutput<Type> {
	let faultyIndex = tokenized.lastIndexOf(InvalidMatch)
	if (!isGoodIndex(faultyIndex))
		return ValidationPassed(tokenized.filter(negate(isValidMatch)) as Type[])

	do tokenized[faultyIndex] = FaultyElement(matched[faultyIndex])
	while (isGoodIndex((faultyIndex = tokenized.lastIndexOf(InvalidMatch, faultyIndex))))
	return ValidationFailed(tokenized as (Type | ValidMatch | FaultyElement<Type>)[])
}

/**
 * Returns an array of `[i, Type]` for those indexes `i`,
 * such that `isFaultyElement(isType)(result[1][i])`
 */
export function analyzeValidity<Type = any>(
	result: ValidationOutput<Type>,
	isType = T as type.TypePredicate<Type>
): InvalidEntries<Type> {
	const [valid, contents] = result
	return valid
		? []
		: contents.filter(isFaultyElement(isType)).map((current, i) => [i, current[1]])
}

/**
 * Returns whether the given `x` is a `FaultyElement`
 */
export const isFaultyElement = <Type = any>(
	isType: type.TypePredicate<Type>
): ((x: ValidMatch | Type | FaultyElement<Type>) => x is FaultyElement<Type>) =>
	isPair<InvalidMatch, Type>(isInvalidMatch, isType)
