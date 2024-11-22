import type { SummatFunction } from "@hgargg-0710/summat.ts"
import type {
	FaultyElement,
	InvalidEntries,
	InvalidMatch,
	ValidationOutput,
	ValidMatch
} from "./interfaces.js"

import { validation } from "../constants.js"
import { isGoodIndex } from "../utils.js"
import { tokenizeString } from "../Tokenizable/utils.js"

import { typeof as type, boolean } from "@hgargg-0710/one"
const { isArray } = type
const { T } = boolean

const { ValidationPassed, ValidationFailed, FaultyElement, InvalidMatch, ValidMatch } =
	validation.ValidatablePattern

export const notValidMatch = (x: any) => x !== ValidMatch

export function validateString(
	string: string,
	key: string | RegExp,
	handler: SummatFunction<any, string, ValidMatch | InvalidMatch>
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

	do {
		tokenized[faultyIndex] = FaultyElement(matched[faultyIndex])
	} while (
		isGoodIndex((faultyIndex = tokenized.lastIndexOf(InvalidMatch, faultyIndex)))
	)

	return ValidationFailed(tokenized as (Type | ValidMatch | FaultyElement<Type>)[])
}

export function analyzeValidity<Type = any>(
	result: ValidationOutput<Type>,
	isType = T as (x?: any) => x is Type
): InvalidEntries<Type> {
	const [valid, contents] = result
	if (valid) return []

	const final: InvalidEntries<Type> = []
	for (let i = 0; i < contents.length; ++i) {
		const current = contents[i]
		if (isFaultyElement(current, isType)) final.push([i, current[1]])
	}

	return final
}

export const analyzedIndex = <Type = any>(analyzed: InvalidEntries<Type>, i: number) =>
	analyzed[i][0]

export const analyzedValue = <Type = any>(analyzed: InvalidEntries<Type>, i: number) =>
	analyzed[i][1]

export const isFaultyElement = <Type = any>(
	x: ValidMatch | Type | FaultyElement<Type>,
	isType: (x: any) => x is Type
): x is FaultyElement<Type> =>
	isArray<InvalidMatch | Type>(x) &&
	x.length === 2 &&
	x[0] === InvalidMatch &&
	isType(x[1])
