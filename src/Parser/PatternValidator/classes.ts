import type { SummatFunction } from "@hgargg-0710/summat.ts"
import type { IndexMap } from "src/IndexMap/interfaces.js"
import type { ValidatablePattern } from "../../Pattern/ValidatablePattern/interfaces.js"
import type { PatternValidatorOutput } from "./interfaces.js"

export function PatternValidator<KeyType = any>(
	validityMap: IndexMap<KeyType, SummatFunction<any, any, boolean>>
) {
	return function <Type = any>(
		pattern: ValidatablePattern<Type, KeyType>
	): PatternValidatorOutput {
		for (let i = 0; i < validityMap.keys.length; ++i)
			if (!pattern.validate(...validityMap.byIndex(i))[0]) return [false, i]
		return !pattern.result[1].length || null
	}
}
