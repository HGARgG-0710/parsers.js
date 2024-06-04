export const mapKeyValue = (obj) => ["keys", "values"].map((x) => obj[x]())
export const lastOut = (x) => x.slice(0, x.length - 1)
export const last = (x) => x[x.length - 1]
export const arrClear = (x) => (x.length = 0)

export const MapClass = (change) =>
	function (map) {
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

export const [PredicateMap, RegExpMap, SetMap] = [
	(curr, x) => curr(x),
	(curr, x) => curr.test(x),
	(curr, x) => curr.has(x)
].map(MapClass)

export function StringPattern(string) {
	return {
		split: function (regexp) {
			return string.split(regexp)
		},
		matchAll: function (regexp) {
			return [...string.matchAll(regexp)]
		},
		get length() {
			return string.length
		},
		class: {
			is: function (checked) {
				return (
					typeof checked === "object" &&
					["split", "matchAll", "length", "class"].every((x) => x in checked)
				)
			}
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
			return input[--this.pos]
		},
		isEnd: function () {
			return this.pos >= input.length
		},
		rewind: function () {
			return input[(this.pos = 0)]
		}
	}
}

export const recursiveIndexation = (tree, multind) =>
	multind.reduce((acc, curr) => acc[curr], tree)

export function ArrayTree(arrtree) {
	return {
		...arrtree,
		children: function () {
			return arrtree
		}
	}
}

// TODO [for the future]: add a 'prev' [can be done easily without changing existing stuff too much...];
export function TreeStream(treeType) {
	let init = treeType
	let currlevel = init
	let current = init
	const multind = []

	const nextLevel = (c) => 0 in c.children()
	const more = (l) => last(multind) + 1 in l.children()

	return {
		next: function () {
			const prev = current

			if (nextLevel(current)) {
				multind.push(0)
				currlevel = current
				current = current.children()[0]
				return prev
			}

			while (multind.length && !more(currlevel)) {
				multind.pop()
				current = currlevel
				currlevel = recursiveIndexation(init, lastOut(multind))
			}
			if (multind.length) {
				current = currlevel.children()[++multind[multind.length - 1]]
				currlevel = prev
			} else current = null

			return prev
		},
		curr: function () {
			return current
		},
		isEnd: function () {
			return !!current
		},
		rewind: function () {
			arrClear(multind)
			currlevel = init
			current = init
			return this.curr()
		}
	}
}

export function StringSource(string) {
	return {
		value: string,
		concat: function (source) {
			return StringSource(string + source.value)
		},
		class: {
			empty: ""
		}
	}
}
