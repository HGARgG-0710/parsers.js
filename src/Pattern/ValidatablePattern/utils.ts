import type { SummatFunction } from "@hgargg-0710/summat.ts"
import type { InvalidEntries, ValidationOutput } from "./interfaces.js"

import { ValidatablePattern } from "src/constants.js"

import { tokenizeMatched } from "../TokenizablePattern/utils.js"
import { matchString } from "../utils.js"

import { typeof as type } from "@hgargg-0710/one"
const { isArray } = type

const notTrue = (x: any) => x !== true

const { ValidationPassed, ValidationFailed, FaultyElement } = ValidatablePattern

export function validateString(
	string: string,
	key: string | RegExp,
	handler: SummatFunction<any, string, boolean>
): ValidationOutput<string> {
	const matched = matchString(string, key)
	const tokenized: (string | boolean | [false, string])[] = tokenizeMatched(
		matched,
		string.split(key),
		handler
	)

	let success: boolean = true
	for (let i = tokenized.length; i--; ) {
		const current = tokenized[i]
		if (current === false) {
			tokenized[i] = FaultyElement(matched[i])
			success = false
		}
	}

	return success
		? ValidationPassed<string>(tokenized.filter(notTrue) as string[])
		: ValidationFailed<string>(tokenized as (string | true | [false, string])[])
}

export function analyzeValidity<Type = any>(
	result: ValidationOutput<Type>
): InvalidEntries<Type> {
	const [valid, contents] = result
	if (valid) return []

	const final: InvalidEntries<Type> = []
	let i = contents.length
	while (i--) {
		const current = contents[i]
		if (
			isArray<false | Type>(current) &&
			current.length === 2 &&
			current[0] === false
		)
			final.push([i, current[1]])
	}

	return final
}

export const analyzedIndex = <Type = any>(
	analyzed: InvalidEntries<Type>,
	i: number
) => analyzed[i][0]

export const analyzedValue = <Type = any>(
	analyzed: InvalidEntries<Type>,
	i: number
) => analyzed[i][1]
