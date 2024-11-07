import type { SummatFunction } from "@hgargg-0710/summat.ts"
import type { IndexMap } from "../../IndexMap/interfaces.js"
import type { ValidatablePattern } from "../../Validatable/interfaces.js"
import type { PatternValidatorOutput } from "./interfaces.js"

import { validation } from "../../constants.js"
const { FullCoverage, NoFullCoverage, ValidationError } = validation.PatternValidator

type BoolHandler = SummatFunction<any, any, boolean>

export function PatternValidator<KeyType = any>(
	validityMap: IndexMap<KeyType, BoolHandler>
) {
	return function <Type = any>(
		pattern: ValidatablePattern<Type, KeyType>
	): PatternValidatorOutput {
		for (let i = 0; i < validityMap.size; ++i)
			if (
				!pattern.validate(
					...(validityMap.byIndex(i) as [KeyType, BoolHandler])
				)[0]
			)
				return ValidationError(i)
		return pattern.result[1].length ? NoFullCoverage : FullCoverage
	}
}
