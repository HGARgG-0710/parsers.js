import { map, array } from "@hgargg-0710/one"
const { kv: mkv } = map
const { insert } = array

export function StreamValidator(validityMap) {
	return function (input) {
		while (!input.isEnd()) {
			const check = validityMap.index(input.curr())
			if (!check || !check(input)) return false
			input.next()
		}
		return true
	}
}
export function PatternValidator(validityMap) {
	const [typeKeys, checks] = mkv(validityMap)
	return function (pattern) {
		const isPattern = pattern.class.is
		const isCollection = pattern.class.collection.is
		const validateSingle = (pattern, typeKey, check) => {
			return pattern
				.matchAll(typeKey)
				.reduce(
					(acc, curr, i) => insert(acc, 2 * i + 1, check(curr)),
					pattern.split(typeKey)
				)
				.filter((x) => typeof x === "boolean" || x.length)
		}
		function keyValidate(pattern) {
			function validateRecursive(current, currKey, i) {
				return isPattern(current)
					? validateSingle(current, currKey, checks[i])
					: isCollection(current)
					? current.map((x) => validateRecursive(x, currKey, i))
					: current
			}
			function booltreeCheck(booltree) {
				return booltree.every((x) =>
					isCollection(x) ? booltreeCheck(x) : x === true
				)
			}
			return booltreeCheck(typeKeys.reduce(validateRecursive, pattern))
		}

		return keyValidate(pattern)
	}
}
