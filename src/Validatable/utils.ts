import type {
	FaultyElement,
	InvalidEntries,
	InvalidMatch,
	ValidationHandler,
	ValidationOutput,
	ValidMatch
} from "./interfaces.js"

import { validation } from "../constants.js"
import { eq, isGoodIndex } from "../utils.js"
import { tokenizeString } from "../Tokenizable/utils.js"

import { isPair } from "../IndexMap/utils.js"

import { boolean } from "@hgargg-0710/one"
import type { TypePredicate } from "../interfaces.js"
const { T } = boolean

const { ValidationPassed, ValidationFailed, FaultyElement, InvalidMatch, ValidMatch } =
	validation.ValidatablePattern

export const notValidMatch = (x: any) => x !== ValidMatch
export const isInvalidMatch = eq(InvalidMatch) as (x: any) => x is InvalidMatch

export function validateString(
	string: string,
	key: string | RegExp,
	handler: ValidationHandler<string>
): ValidationOutput<string> {
	const [matched, , tokenized] = tokenizeString(string, key, handler)
	return validateTokenized(matched, tokenized)
}

export function validateTokenized<Type = any>(
	matched: Type[],
	tokenized: (Type | ValidMatch | InvalidMatch | FaultyElement<Type>)[]
): ValidationOutput<Type> {
	let faultyIndex = tokenized.lastIndexOf(InvalidMatch)
	if (!isGoodIndex(faultyIndex))
		return ValidationPassed(tokenized.filter(notValidMatch) as Type[])

	do tokenized[faultyIndex] = FaultyElement(matched[faultyIndex])
	while (isGoodIndex((faultyIndex = tokenized.lastIndexOf(InvalidMatch, faultyIndex))))
	return ValidationFailed(tokenized as (Type | ValidMatch | FaultyElement<Type>)[])
}

export function analyzeValidity<Type = any>(
	result: ValidationOutput<Type>,
	isType = T as TypePredicate<Type>
): InvalidEntries<Type> {
	const [valid, contents] = result
	const final: InvalidEntries<Type> = []

	if (!valid) {
		const faultyPred = isFaultyElement(isType)
		for (let i = 0; i < contents.length; ++i) {
			const current = contents[i]
			if (faultyPred(current)) final.push([i, current[1]])
		}
	}

	return final
}

export const analyzedIndex = <Type = any>(analyzed: InvalidEntries<Type>, i: number) =>
	analyzed[i][0]

export const analyzedValue = <Type = any>(analyzed: InvalidEntries<Type>, i: number) =>
	analyzed[i][1]

export const isFaultyElement = <Type = any>(
	isType: TypePredicate<Type>
): ((x: ValidMatch | Type | FaultyElement<Type>) => x is FaultyElement<Type>) =>
	isPair<InvalidMatch, Type>(isInvalidMatch, isType)
