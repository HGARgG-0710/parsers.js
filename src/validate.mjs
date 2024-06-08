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
	return function (pattern) {
		const isPattern = pattern.class.is
		function validateSingle(pattern, token) {
			const [typeKey, check] = token
			return pattern
				.matchAll(typeKey)
				.reduce(
					(acc, curr, i) => insert(acc, 2 * i + 1, check(curr)),
					pattern.split(typeKey)
				)
				.filter((x) => typeof x === "boolean" || x.length)
				.every((x) => x)
		}
		function validateRecursive(pattern) {
			return !!mkv(validityMap).reduce(
				(acc, currToken) =>
					acc
						? ((x) => x.every((x) => x) && x)(
								acc.map((x) =>
									isPattern(x) ? validateSingle(x, currToken) : x
								)
						  )
						: acc,
				[pattern]
			)
		}

		return validateRecursive(pattern)
	}
}
