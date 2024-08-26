import type { Pattern, PatternCollection } from "../types/Pattern.js"
import { Token } from "../types/Token.js"

import { table, type IndexMap } from "../types/IndexMap.js"
import type { SummatFunction } from "../types/Summat.js"

import { array } from "@hgargg-0710/one"
const { insert } = array

export function PatternTokenizer<KeyType = any, OutType = any>(
	tokenMap: IndexMap<KeyType, SummatFunction<any, KeyType, OutType>>,
	tokenCheck: (x?: any) => boolean = Token.is
) {
	const [typeKeys, typeFunction] = table(tokenMap)
	return function (pattern: Pattern<any, KeyType, KeyType>) {
		const isPattern = pattern.class.is
		const collectionClass = pattern.class.collection
		const isCollection = collectionClass.is
		const tokenizeSingle = (
			pattern: Pattern<any, KeyType, KeyType>,
			typeKey: KeyType,
			type: SummatFunction<any, KeyType, OutType>
		) =>
			pattern
				.matchAll(typeKey)
				.reduce(
					(
						acc: PatternCollection<any, KeyType, KeyType>,
						curr: any,
						i: number
					) => insert(acc, 2 * i + 1, type(curr)),
					pattern.split(typeKey)
				)
				.filter((x: any) => tokenCheck(x) || x.length)

		function keyTokenize(pattern: Pattern<any, KeyType, KeyType>) {
			const flatten = (collection: PatternCollection<any, KeyType, KeyType>) =>
				collection.reduce(
					(
						last: PatternCollection<any, KeyType, KeyType>,
						curr:
							| Pattern<any, KeyType, KeyType>
							| PatternCollection<any, KeyType, KeyType>
					) => last.concat(isCollection(curr) ? flatten(curr) : [curr]),
					collectionClass()
				)
			const tokenizeRecursive = (
				current:
					| Pattern<any, KeyType, KeyType>
					| PatternCollection<any, KeyType, KeyType>,
				currKey: KeyType,
				i: number
			) =>
				isPattern(current)
					? tokenizeSingle(current, currKey, typeFunction[i])
					: isCollection(current)
					? current.map((x) => tokenizeRecursive(x, currKey, i))
					: current

			return flatten(typeKeys.reduce(tokenizeRecursive, pattern))
		}

		return keyTokenize(pattern)
	}
}
