import { array, object, map, function as f } from "@hgargg-0710/one"

const { and } = f
const { kv: mkv } = map
const { structCheck } = object
const { first, last, lastOut, clear, iterator, propPreserve } = array

export const Token = (type, value) => ({ type, value })
Token.is = structCheck(["type", "value"])
Token.type = (x) => x.type
Token.value = (x) => x.value

export const isType = (type) => and(structCheck([]), (x) => Token.type(x) === type)

export const TokenInstance = (type) => {
	const ti = () => ({ type })
	ti.is = isType(type)
	return ti
}

export const TokenType = (type) => {
	const tt = (value) => Token(type, value)
	tt.is = isType(type)
	return tt
}

export const MapClass = (change) => {
	const mapClass = function (map, _default) {
		const [mapKeys, mapValues] = mkv(map)
		return {
			default: () => _default,
			keys: () => mapKeys,
			values: () => mapValues,
			index: (x) =>
				((x) => (typeof x === "number" ? mapValues[x] : x))(
					mapKeys.reduce(
						(key, curr, i) =>
							key !== _default ? key : change(curr, x) ? i : key,
						_default
					)
				)
		}
	}
	mapClass.extend = (f) => MapClass((curr, x) => change(curr, f(x)))
	return mapClass
}

export const [PredicateMap, RegExpMap, SetMap, BasicMap] = [
	(curr, x) => curr(x),
	(curr, x) => curr.test(x),
	(curr, x) => curr.has(x),
	(curr, x) => curr === x
].map(MapClass)

export const TokenMap = (mapClass) => mapClass.extend(Token.type)

export function StringPattern(string = "") {
	return {
		value: string,
		split: (regexp) =>
			StringPatternCollection(string.split(regexp).map(StringPattern)),
		matchAll: (regexp) =>
			StringPatternCollection(
				[...string.matchAll(regexp)].map(first).map(StringPattern)
			),
		get length() {
			return string.length
		},
		class: StringPattern
	}
}

StringPattern.is = structCheck(["split", "matchAll", "length", "class"])
StringPattern.empty = StringPattern()
StringPattern.collection = StringPatternCollection

export function StringPatternCollection(arr = []) {
	return {
		value: arr,
		join: function (x = StringPattern()) {
			return StringPattern(arr.map((x) => x.value).join(x.value))
		},
		filter: function (predicate = (x) => x) {
			return StringPatternCollection(arr.filter(predicate))
		},
		reduce: function (predicate, init) {
			return arr.reduce(predicate, init)
		},
		every: function (predicate = (x) => x) {
			return arr.every(predicate)
		},
		slice: function (start = 0, end = arr.length) {
			return StringPatternCollection(arr.slice(start, end))
		},
		concat: function (collection = []) {
			return StringPatternCollection([...arr, ...collection])
		},
		map: function (f) {
			return StringPatternCollection(arr.map(f))
		},
		[Symbol.iterator]: iterator(arr)
	}
}

StringPatternCollection.is = structCheck([
	"join",
	"filter",
	"reduce",
	"every",
	"slice",
	"concat",
	Symbol.iterator
])

const mapPropsPreserve = (f) => propPreserve((array) => array.map(f))
export const ArrayToken = propPreserve((token) => [...Token.value(token)])

const iteratorCheck = structCheck([Symbol.iterator])
export function RecursiveArrayToken(recursiveToken) {
	const isCollection = "value" in recursiveToken && iteratorCheck(recursiveToken.value)
	if (isCollection) recursiveToken.value = recursiveToken.value.map(RecursiveArrayToken)
	return isCollection ? ArrayToken(recursiveToken) : recursiveToken
}

export function InputStream(input) {
	return {
		pos: 0,
		curr: function () {
			return input[this.pos]
		},
		next: function () {
			return input[this.pos++]
		},
		prev: function () {
			return input[this.pos--]
		},
		isEnd: function () {
			return this.pos >= input.length
		},
		rewind: function () {
			return input[(this.pos = 0)]
		},
		copy: function () {
			const inputStream = InputStream(input)
			inputStream.pos = this.pos
			return inputStream
		}
	}
}

// ? Move these things out of scope? [create a separate function-scope for them?]
const arrayTreePreserve = mapPropsPreserve(ArrayTree)
export function ArrayTree(arrtree) {
	function ArrTreeLevel(level) {
		level.children = function () {
			return this
		}
		level.index = function (multind) {
			return multind.reduce((prev, curr) => prev.children()[curr], this)
		}
		return level
	}
	return arrtree instanceof Array ? ArrTreeLevel(arrayTreePreserve(arrtree)) : arrtree
}

// TODO [for the future]: add a 'prev' [can be done easily without changing existing stuff too much...];
// ^ NOTE: the 'prev' implementation is farily straightforward - it's just a reversed 'next' (going from 'bottom-to-top' and 'from-end-to-beginning'), so instead of checking for `0 in c.children()` and `last(...) + 1 in l.children()`, one checks for `l === tree` and `last(...) - 1 in l.children()`
// ! BUT one will also need to alter the 'next()', BECAUSE, both of them will now need to ALSO go down AND up the tree (one will additionally need to remember what was last not to 'skip' any "branches"...);
export function TreeStream(tree) {
	let currlevel = tree
	let current = tree.children()[0]
	const multind = [0]

	const ENDVALUE = {}

	const nextLevel = (c) => c.children && 0 in c.children()
	const isMore = (l) => last(multind) + 1 in l.children()

	return {
		next: function () {
			const prev = current
			if (nextLevel(current)) {
				multind.push(0)
				currlevel = current
				current = current.children()[0]
				return prev
			}
			while (multind.length && !isMore(currlevel)) {
				multind.pop()
				current = currlevel
				currlevel = tree.index(lastOut(multind))
			}
			current = multind.length
				? currlevel.children()[++multind[multind.length - 1]]
				: ENDVALUE
			return prev
		},
		curr: function () {
			return current
		},
		isEnd: function () {
			return current === ENDVALUE
		},
		rewind: function () {
			clear(multind)
			currlevel = tree
			current = tree
			return this.curr()
		}
	}
}

export function StringSource(string = "") {
	return {
		value: string,
		concat: function (source) {
			return StringSource(string + source.value)
		}
	}
}
StringSource.empty = StringSource()

export function TokenSource(token) {
	return {
		value: token,
		concat: function (plus) {
			return TokenSource({ ...token, value: token.value.concat(plus.value) })
		}
	}
}
