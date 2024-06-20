import type { IndexMap } from "../types/IndexMap.js"
import type { Pattern, PatternCollection } from "../types/Pattern.js"
import { Token } from "../types/Token.js"

import { map, array } from "@hgargg-0710/one"
const { kv: mkv } = map
const { insert } = array

export function PatternTokenizer<KeyType = any>(
	tokenMap: IndexMap<KeyType, Function>,
	tokenCheck: Function = Token.is
) {
	const [typeKeys, typeFunction] = mkv(tokenMap)
	return function (pattern: Pattern) {
		const isPattern = pattern.class.is
		const collectionClass = pattern.class.collection
		const isCollection = collectionClass.is
		const tokenizeSingle = (pattern: Pattern, typeKey: KeyType, type: Function) =>
			pattern
				.matchAll(typeKey)
				.reduce(
					(acc: PatternCollection, curr: any, i: number) =>
						insert(acc, 2 * i + 1, type(curr)),
					pattern.split(typeKey)
				)
				.filter((x: any) => tokenCheck(x) || x.length)

		function keyTokenize(pattern: Pattern) {
			const flatten = (collection: PatternCollection) =>
				collection.reduce(
					(last: PatternCollection, curr: Pattern | PatternCollection) =>
						last.concat(isCollection(curr) ? flatten(curr) : [curr]),
					collectionClass()
				)
			const tokenizeRecursive = (
				current: Pattern | PatternCollection,
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
