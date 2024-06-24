import { array } from "@hgargg-0710/one"
import { table, type ParserFunction, type ParserMap } from "../parsers.js"
import type { Pattern, PatternCollection } from "../types.js"
const { insert } = array

export function PatternValidator<KeyType>(validityMap: ParserMap<KeyType, boolean>) {
	const [typeKeys, checks] = table(validityMap)
	return function (pattern: Pattern<any, KeyType, KeyType>) {
		const isPattern = pattern.class.is
		const isCollection = pattern.class.collection.is
		const validateSingle = (
			pattern: Pattern<any, KeyType, KeyType>,
			typeKey: KeyType,
			check: ParserFunction<boolean>
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
