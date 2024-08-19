import { array } from "@hgargg-0710/one"
import { table } from "../types/IndexMap.js"
import type { IndexMap, Pattern, PatternCollection, SummatFunction } from "../types.js"
const { insert } = array

// ? Generalize this to analyze a given pattern "globally" in terms of tokens? (id est, allow to LOCATE the 'non-true' bits and return them, along with locations/indexes?);
export function PatternValidator<KeyType>(
	validityMap: IndexMap<KeyType, SummatFunction<any, boolean>>
) {
	const [typeKeys, checks] = table(validityMap)
	return function (pattern: Pattern<any, KeyType, KeyType>) {
		const isPattern = pattern.class.is
		const isCollection = pattern.class.collection.is
		const validateSingle = (
			pattern: Pattern<any, KeyType, KeyType>,
			typeKey: KeyType,
			check: SummatFunction<KeyType, boolean>
		) => {
			return (
				pattern
					.matchAll(typeKey)
					.reduce(
						(acc, curr, i) => insert(acc, 2 * i + 1, check(curr)),
						pattern.split(typeKey)
					) as PatternCollection<any, KeyType, KeyType>
			).filter((x) => typeof x === "boolean" || (isPattern(x) && x.length))
		}

		function keyValidate(pattern: Pattern<any, KeyType, KeyType>) {
			function validateRecursive(
				current:
					| Pattern<any, KeyType, KeyType>
					| PatternCollection<any, KeyType, KeyType>,
				currKey: KeyType,
				i: number
			) {
				return isPattern(current)
					? validateSingle(current, currKey, checks[i])
					: isCollection(current)
					? current.map((x) => validateRecursive(x, currKey, i))
					: current
			}

			function booltreeCheck(booltree: PatternCollection<any, KeyType, KeyType>) {
				return booltree.every(
					(x: boolean | PatternCollection<any, KeyType, KeyType>) =>
						isCollection(x) ? booltreeCheck(x) : x === true
				)
			}

			return booltreeCheck(typeKeys.reduce(validateRecursive, pattern))
		}

		return keyValidate(pattern)
	}
}
