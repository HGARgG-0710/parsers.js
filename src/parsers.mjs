import { mapKeyValue } from "./types.mjs"

export const insertArr = (arr, ind, val) =>
	arr.slice(0, ind).concat([val]).concat(arr.slice(ind))

export const isNumber = (x) => typeof x === "number" || x instanceof Number
export const predicateChoice = (x) => (isNumber(x) ? (input, i) => i < x : x)

export const predFromSet = (set) => (x) => set.has(x)

export const token = (type, value) => ({ type, value })
export const type = (x) => x.type
export const value = (x) => x.value
export const isToken = (x) => ["type", "value"].every((y) => y in x)

export function delimited(
	limits,
	isdelim,
	expectRepeats = false,
	evenStep = false,
	skipFirst = false
) {
	const pred =
		limits instanceof Array
			? predicateChoice(limits[1]) || predicateChoice(limits[0])
			: predicateChoice(limits)
	const prePred = !!limits[1] && predicateChoice(limits[0])
	const delimPred = expectRepeats ? () => true : (input, i) => (i + evenStep) % 2

	return function (input, handler) {
		if (prePred) {
			skip(input)(prePred)
			if (skipFirst) input.next()
		}
		const result = []
		for (let i = 0; pred(input, i) && !input.isEnd(); ++i) {
			while (delimPred(input, i) && isdelim(input.curr())) {
				input.next()
				continue
			}
			result.push(handler(input))
			i++
		}
		return result
	}
}
export function eliminate(symbols) {
	return (pattern) => symbols.reduce((acc, curr) => acc.split(curr).join(""), pattern)
}
export function skip(input) {
	return function (steps = 1) {
		let i = 0
		const pred = predicateChoice(steps)
		while (pred(input, i) && !input.isEnd()) {
			input.next()
			i++
		}
		return i
	}
}

export function PatternTokenizer(tokenMap) {
	return function (pattern) {
		const patternClass = pattern.class
		const tokenType = (_token) => (value) => token(_token[1], value)

		function tokenizeSingle(pattern, token) {
			const type = tokenType(token)
			const regexp = token[0]
			return pattern
				.matchAll(regexp)
				.map((x) => x[0])
				.reduce(
					(acc, curr, i) => insertArr(acc, 2 * i + 1, type(curr)),
					pattern.split(regexp)
				)
				.filter((x) => isToken(x) || x.length)
		}
		function tokenizeRecursive(pattern) {
			return mapKeyValue(tokenMap).reduce(
				(acc, currToken) =>
					acc
						.map((x) =>
							patternClass.is(x) ? tokenizeSingle(x, currToken) : x
						)
						.flat(),
				[pattern]
			)
		}

		return tokenizeRecursive(pattern)
	}
}
export function StreamTokenizer(tokenMap) {
	return function (input) {
		let current = null
		return {
			next: function () {
				const prev = current
				current = ((x) => (x ? x.call(this, input) : x))(
					tokenMap.index(input.curr())
				)
				return prev
			},
			curr: function () {
				if (!current) this.next()
				return current
			},
			isEnd: function () {
				return !!this.curr()
			}
		}
	}
}
export function StreamParser(parserTable) {
	const parser = function (input) {
		const final = []
		while (!input.isEnd())
			final.push(...parserTable[type(input.curr())](input, parser))
		return final
	}
	return parser
}
