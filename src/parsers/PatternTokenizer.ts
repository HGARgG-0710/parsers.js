import { Token } from "./types"
import { map, array } from "@hgargg-0710/one"
const { kv: mkv } = map
const { insert } = array

export function PatternTokenizer(tokenMap, tokenCheck = Token.is) {
	const [typeKeys, typeFunction] = mkv(tokenMap)
	return function (pattern) {
		const isPattern = pattern.class.is
		const collectionClass = pattern.class.collection
		const isCollection = collectionClass.is
		const tokenizeSingle = (pattern, typeKey, type) =>
			pattern
				.matchAll(typeKey)
				.reduce(
					(acc, curr, i) => insert(acc, 2 * i + 1, type(curr)),
					pattern.split(typeKey)
				)
				.filter((x) => tokenCheck(x) || x.length)

		function keyTokenize(pattern) {
			const flatten = (collection) =>
				collection.reduce(
					(last, curr) =>
						last.concat(isCollection(curr) ? flatten(curr) : [curr]),
					collectionClass()
				)
			const tokenizeRecursive = (current, currKey, i) =>
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
