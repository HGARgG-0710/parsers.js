export function StreamTokenizer(tokenMap) {
	return function (input) {
		let current = null
		return {
			next: function () {
				const prev = current
				current = ((x) => (typeof x === "function" ? x.call(this, input) : x))(
					tokenMap.index(input.curr())
				)
				input.next()
				return prev
			},
			curr: function () {
				if (!current) this.next()
				return current
			},
			isEnd: function () {
				return !this.curr()
			}
		}
	}
}