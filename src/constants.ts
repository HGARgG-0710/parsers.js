import type { ValidationOutput } from "./Pattern/ValidatablePattern/interfaces.js"

import type { ValidationError } from "./Parser/PatternValidator/interfaces.js"
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
	export const ValidationPassed = <Type = any>(
		result: Type[]
	): ValidationOutput<Type> => [true, result]

	export const ValidationFailed = <Type = any>(
		result: (Type | true | [false, Type])[]
	): ValidationOutput<Type> => [false, result]

	export const FaultyElement = ValidationFailed as <Type = any>(
		x: Type
	) => [false, Type]
}
