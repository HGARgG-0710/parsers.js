import type { ValidationError } from "./Parser/PatternValidator/interfaces.js"

import type {
	InvalidMatch,
	ValidationOutput,
	ValidMatch
} from "./Pattern/ValidatablePattern/interfaces.js"

import { boolean } from "@hgargg-0710/one"
const { T } = boolean

export namespace StreamClass {
	export const PreCurrInit = 1
	export const PostCurrInit = true
	export const PostStart = false
	export const DefaultRealCurr = null
}

export namespace LimitedStream {
	export const NoMovementPredicate = T
}

export namespace PatternValidator {
	export const NoFullCoverage = null
	export const FullCoverage = true
	export const ValidationError = (n: number): ValidationError => [false, n]
}

export namespace ValidatablePattern {
	export const ValidMatch: ValidMatch = true
	export const InvalidMatch: InvalidMatch = false

	export const ValidationPassed = <Type = any>(
		result: Type[]
	): ValidationOutput<Type> => [ValidMatch, result]

	export const ValidationFailed = <Type = any>(
		result: (Type | true | [false, Type])[]
	): ValidationOutput<Type> => [InvalidMatch, result]

	export const FaultyElement = ValidationFailed as <Type = any>(
		x: Type
	) => [false, Type]
}

export namespace regex {
	export const IndefiniteOccurrences = ""
}
