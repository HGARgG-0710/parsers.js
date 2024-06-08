import { array } from "@hgargg-0710/one"
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
						(key, curr, i) => (key ? key : change(curr, x) ? i : key),
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
		}
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
		filter: function (predicate) {
			return StringPatternCollection(arr.filter(predicate))
		},
		reduce: function (predicate, init) {
			return arr.reduce(predicate, init)
		},
		every: function (predicate) {
			return arr.every(predicate)
		},
		slice: function (start, end) {
			return StringPatternCollection(arr.slice(start, end))
		},
		concat: function (collection) {
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
			return level
		}
		level.index = function (multind) {
			return multind.reduce((prev, curr) => prev.children()[curr], this)
		}
		return level
	}

	return ArrTreeLevel(arrtree)
		.children()
		.map((x) => (x instanceof Array ? ArrayTree : (x) => x)(x))
}

// TODO [for the future]: add a 'prev' [can be done easily without changing existing stuff too much...];
export function TreeStream(treeType) {
	let init = treeType
	let currlevel = init
	let current = init
	const multind = []

	const nextLevel = (c) => 0 in c.children()
	const isMore = (l) => last(multind) + 1 in l.children()
	// ! for 'prev'
	// const isLimit = (l) => l === init
	// const isLess = (l) => last(multind) - 1 in l.children()

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
				currlevel = init.index(lastOut(multind))
			}
			if (multind.length) {
				current = currlevel.children()[++multind[multind.length - 1]]
				currlevel = prev
			} else current = null

			return prev
		},
		// ! Later, fix the implementation of 'prev' [need to remember what was the previous one - 'prev' or 'next'];
		// prev: function () {
		// 	const next = current
		// 	const nisless = !isLess(currlevel)

		// 	if (nisless) {
		// 		if (isLimit(currlevel)) return next
		// 		multind.pop()
		// 		current = currlevel
		// 		currlevel = init.index(lastOut(multind))
		// 		return next
		// 	}

		// 	// ! PROBLEM [here] - the 'prev' CANNOT continue successfully - it needs to KNOW that the last one WAS NOT a 'next' [otherwise, the order is ruined - it 'skips' all the subbranches];
		// 	// ^ NOTE: same problem is with the 'next';
		// 	current = currlevel.children()[--multind[multind.length - 1]]
		// 	return next
		// },
		curr: function () {
			return current
		},
		isEnd: function () {
			return !!current
		},
		rewind: function () {
			clear(multind)
			currlevel = init
			current = init
			return this.curr()
		}
	}
}

export function StringSource(string) {
	return {
		value: string || "",
		concat: function (source) {
			return StringSource(string + source.value)
		}
	}
}
StringSource.empty = ""

export const Token = (type, value) => ({ type, value })
