import { map, array } from "@hgargg-0710/one"
import { Token } from "./types.mjs"
const { kv: mkv } = map
const { insert } = array

export const isNumber = (x) => typeof x === "number" || x instanceof Number
export const predicateChoice = (x) => (isNumber(x) ? (input, i) => i < x : x)

export const setPredicate = (set) => (x) => set.has(x)

export const type = (x) => x.type
export const value = (x) => x.value
export const isToken = (x) =>
	typeof x === "object" && ["type", "value"].every((y) => y in x)

export function delimited(limits, isdelim) {
	if (!(limits instanceof Array)) limits = [limits]
	const pred = predicateChoice(limits[1]) || predicateChoice(limits[0])
	const prePred = 1 in limits && predicateChoice(limits[0])

	return function (input, handler) {
		const _skip = skip(input)
		if (prePred) _skip(prePred)
		const result = []
		for (let i = 0, j = 0; pred(input, i) && !input.isEnd(); ++i) {
			j += _skip((input, _j) => isdelim(input, i + j + _j))
			if (!input.isEnd()) result.push(handler(input, i + j))
		}
		return result
	}
}
export function eliminate(symbols) {
	return (pattern, nil = pattern.class.empty) =>
		symbols.reduce((acc, curr) => acc.split(curr).join(nil), pattern)
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
	const tokenType = (_token) => (value) => Token(_token[1], value)
	return function (pattern) {
		const isPattern = pattern.class.is
		function tokenizeSingle(pattern, token) {
			const type = tokenType(token)
			const typeKey = token[0]
			return pattern
				.matchAll(typeKey)
				.reduce(
					(acc, curr, i) => insert(acc, 2 * i + 1, type(curr)),
					pattern.split(typeKey)
				)
				.filter((x) => isToken(x) || x.length)
		}
		function tokenizeRecursive(pattern) {
			return mkv(tokenMap).reduce(
				(acc, currToken) =>
					acc
						.map((x) => (isPattern(x) ? tokenizeSingle(x, currToken) : x))
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
					tokenMap.index(input.next())
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
export function StreamParser(parserMap) {
	const parser = function (input) {
		const final = []
		while (!input.isEnd()) {
			final.push(...parserMap.index(input.curr())(input, parser))
			input.next()
		}
		return final
	}
	return parser
}
