import type { SummatFunction } from "@hgargg-0710/summat.ts"

import { type IndexMap } from "../types/IndexMap.js"
import type { ValidatablePattern } from "../types/Pattern.js"

export type PatternValidatorOutput = true | null | [false, number]

// ^ 'null' indicates non-coverage, 'true' indicates correctness and coverage, 'false' indicates incorrectness (comes additionally with a position);
export function PatternValidator<KeyType = any>(
	validityMap: IndexMap<KeyType, SummatFunction<any, any, boolean>>
) {
	return function <Type = any>(pattern: ValidatablePattern<Type, KeyType>) {
		for (let i = 0; i < validityMap.keys.length; ++i) {
			const [key, handler] = validityMap.byIndex(i)
			const result = pattern.validate(key, handler)
			if (!result[0]) return [false, i]
		}
		return !pattern.result[1].length ? true : null
	}
}
