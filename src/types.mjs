import { array } from "@hgargg-0710/one"
import { type } from "./parsers.mjs"
const { last, lastOut, clear } = array

export const MapClass = (change) => {
	const mapClass = function (map) {
		const [mapKeys, mapValues] = ["keys", "values"].map((x) =>
			Array.from(map[x].bind(map)())
		)
		return {
			keys: () => mapKeys,
			values: () => mapValues,
			index: (x) =>
				((x) => (typeof x === "number" ? mapValues[x] : x))(
					mapKeys.reduce(
						(key, curr, i) =>
							key !== undefined ? key : change(curr, x) ? i : key,
						undefined
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

export const TokenMap = (mapClass) => mapClass.extend(type)

export function StringPattern(string) {
	return {
		value: string,
		split: (regexp) => StringPatternCollection(string.split(regexp)),
		matchAll: (regexp) =>
			StringPatternCollection([...string.matchAll(regexp)].map((x) => x[0])),
		get length() {
			return string.length
		},
		class: StringPattern
	}
}

StringPattern.is = (checked) =>
	typeof checked === "object" &&
	["split", "matchAll", "length", "class"].every((x) => x in checked)
StringPattern.empty = ""

export function StringPatternCollection(arr) {
	return {
		join: function (x = "") {
			return StringPattern(arr.join(x))
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
		[Symbol.iterator]: function* () {
			for (let i = 0; i < arr.length; ++i) yield arr[i]
		}
	}
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
		}
	}
}

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
	return arrtree instanceof Array ? ArrTreeLevel(arrtree.map(ArrayTree)) : arrtree
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
StringSource.empty = ""

export const Token = (type, value) => ({ type, value })
