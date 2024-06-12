import { map, array } from "@hgargg-0710/one"
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
		const endpred = (input, i) => !input.isEnd() && pred(input, i)
		for (let i = 0, j = 0; endpred(input, i, j); ++i) {
			j += _skip((input, _j) => isdelim(input, i + j + _j))
			if (!endpred(input, i)) break
			result.push(...handler(input, i + j))
			input.next()
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
		while (!input.isEnd() && pred(input, i)) {
			input.next()
			i++
		}
		return i
	}
}

export function PatternTokenizer(tokenMap) {
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
				.filter((x) => isToken(x) || x.length)

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
export function StreamTokenizer(tokenMap) {
	return function (input) {
		let current = null
		return {
			next: function () {
				const prev = current
				current = ((x) => (x ? x.call(this, input) : x))(
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
export function StreamParser(parserMap) {
	const parser = (input) => parserMap.index(input.curr())(input, parser)
	return function (input) {
		const final = []
		while (!input.isEnd()) {
			final.push(...parser(input))
			input.next()
		}
		return final
	}
}
