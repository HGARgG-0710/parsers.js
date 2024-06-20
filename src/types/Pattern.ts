import { array, object } from "@hgargg-0710/one"
const { first, iterator } = array
const { structCheck } = object

export type Iterable = {
	[Symbol.iterator]: GeneratorFunction
}

export interface PatternCollectionClass<Type = any, SplitType = any, MatchType = any> {
	(x?: any): PatternCollection<Type, SplitType, MatchType>
	is(x: any): x is PatternCollection<Type, SplitType, MatchType>
}

export interface PatternClass<Type = any, SplitType = any, MatchType = any> {
	(x?: Type): Pattern<Type, SplitType, MatchType>
	is(x: any): x is Pattern
	empty: Pattern<Type, SplitType, MatchType>
	collection: PatternCollectionClass
}

export interface Pattern<Type = any, SplitType = any, MatchType = any> {
	value: Type
	split: (x: SplitType) => PatternCollection<Type>
	matchAll: (x: MatchType) => PatternCollection<Type>
	get length(): number
	class: PatternClass<Type, SplitType, MatchType>
}

export interface PatternCollection<Type = any, SplitType = any, MatchType = any>
	extends Iterable {
	value: any
	join: (x: Pattern<Type, SplitType, MatchType>) => Pattern<Type, SplitType, MatchType>
	filter: (
		predicate: (x?: any, i?: number, arr?: any) => boolean
	) => PatternCollection<Type, SplitType, MatchType>
	reduce: (predicate: (prev?: any, curr?: any, i?: number) => any, init: any) => any
	every: (predicate: (x: any) => any) => boolean
	slice: (start: number, end: number) => PatternCollection<Type, SplitType, MatchType>
	concat: (collection: Iterable) => PatternCollection<Type, SplitType, MatchType>
	map: (f: (x?: Pattern<Type>, i?: number, arr?: any) => any) => any
}

export function StringPattern(string = ""): Pattern<string, RegExp, RegExp> {
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
StringPattern.is = structCheck("split", "matchAll", "length", "class")
StringPattern.empty = StringPattern()
StringPattern.collection = StringPatternCollection

export function StringPatternCollection(
	arr = []
): PatternCollection<string, RegExp, RegExp> {
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
		concat: function (collection: Iterable = [] as unknown as Iterable) {
			return StringPatternCollection([...arr, ...collection])
		},
		map: function (f) {
			return StringPatternCollection(arr.map(f))
		},
		[Symbol.iterator]: iterator(arr)
	}
}

StringPatternCollection.is = structCheck(
	"join",
	"filter",
	"reduce",
	"every",
	"slice",
	"concat",
	Symbol.iterator
)
