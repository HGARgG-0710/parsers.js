import { type, insertArr } from "./parsers.mjs"
import { mapKeyValue } from "./types.mjs"

export function StreamValidator(validityTable) {
	return function (input) {
		while (!input.isEnd()) {
			const check = validityTable[type(input.curr())]
			if (!check || !check(input)) return false
			input.next()
		}
		return true
	}
}
export function PatternValidator(validityMap) {
	return function (pattern) {
		const patternClass = pattern.class

		function validateSingle(pattern, token) {
			const [regexp, check] = token
			return pattern
				.matchAll(regexp)
				.map((x) => x[0])
				.reduce(
					(acc, curr, i) => insertArr(acc, 2 * i + 1, check(curr)),
					pattern.split(regexp)
				)
				.filter((x) => typeof x === "boolean" || x.length)
				.every((x) => x)
		}
		function validateRecursive(pattern) {
			return !!mapKeyValue(validityMap).reduce(
				(acc, currToken) =>
					acc
						? ((x) => x.every((x) => x) && x)(
								acc.map((x) =>
									patternClass.is(x) ? validateSingle(x, currToken) : x
								)
						  )
						: acc,
				[pattern]
			)
		}

		return validateRecursive(pattern)
	}
}

export function TreeValidator(validationMap) {
	return function (treeStream) {
		while (!treeStream.isEnd()) {
			const check = validationMap.index(treeStream)
			if (!check || !check(treeStream.curr())) return false
			treeStream.next()
		}
		return true
	}
}
