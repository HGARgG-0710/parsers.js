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