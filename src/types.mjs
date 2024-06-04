export const mapKeyValue = (obj) => ["keys", "values"].map((x) => obj[x]())

export function RegExpMap(map) {
	const [mapKeys, mapValues] = ["keys", "values"].map((x) =>
		Array.from(map[x].bind(map)())
	)
	return {
		keys: () => mapKeys,
		values: () => mapValues,
		index: (x) =>
			((x) => (typeof x === "number" ? mapValues[x] : x))(
				mapKeys.reduce(
					(key, curr, i) => (key ? key : curr.test(x) ? i : key),
					undefined
				)
			)
	}
}

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
