import { array, object } from "@hgargg-0710/one"
import type { Summat, SummatFunction } from "./Summat.js"
import { extract, type DelimPredicate, type RewindableStream } from "main.js"
const { first, iterator } = array
const { structCheck } = object

export interface Iterable<Type = any, ReturnType = any> extends Summat {
	[Symbol.iterator]: () => Generator<Type, ReturnType>
}

export interface PatternCollectionClass<Type = any, SplitType = any, MatchType = any>
	extends Summat {
	(x?: any): PatternCollection<Type, SplitType, MatchType>
	is(x: any): x is PatternCollection<Type, SplitType, MatchType>
}

export interface PatternClass<Type = any, SplitType = any, MatchType = any>
	extends Summat {
	(x?: Type): Pattern<Type, SplitType, MatchType>
	is(x: any): x is Pattern
	empty: Pattern<Type, SplitType, MatchType>
	collection: PatternCollectionClass
}

export interface Pattern<Type = any, SplitType = any, MatchType = any> extends Summat {
	value: Type
	split: (x: SplitType) => PatternCollection<Type, SplitType, MatchType>
	matchAll: (x: MatchType) => PatternCollection<Type, SplitType, MatchType>
	get length(): number
	class: PatternClass<Type, SplitType, MatchType>
}

export interface PatternCollection<Type = any, SplitType = any, MatchType = any>
	extends Iterable {
	value: any
	join: (x: Pattern<Type, SplitType, MatchType>) => Pattern<Type, SplitType, MatchType>
	filter: (
		predicate: (x?: any, i?: number, arr?: any) => any
	) => PatternCollection<Type, SplitType, MatchType>
	reduce: (predicate: (prev?: any, curr?: any, i?: number) => any, init: any) => any
	every: (predicate: (x: any) => any) => boolean
	slice: (start: number, end: number) => PatternCollection<Type, SplitType, MatchType>
	concat: (collection: Iterable) => PatternCollection<Type, SplitType, MatchType>
	map: (f: (x?: Pattern<Type>, i?: number, arr?: any) => any) => any
}

export const isPattern: (x: any) => x is Pattern = structCheck(
	"split",
	"matchAll",
	"length",
	"class"
)

export const isPatternCollection: (x: any) => x is PatternCollection = structCheck(
	"join",
	"filter",
	"reduce",
	"every",
	"slice",
	"concat",
	Symbol.iterator
)

export const StringPattern: PatternClass<string, RegExp | string, RegExp | string> = (
	string = ""
): Pattern<string, RegExp, RegExp> => {
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
StringPattern.is = isPattern
StringPattern.empty = StringPattern()

export function stringPatternCollectionMap(f: Function) {
	return StringPatternCollection(this.value.map(f))
}
export function stringPatternCollectionConcat(
	collection: Iterable = [] as unknown as Iterable
) {
	return StringPatternCollection([...this.value, ...collection])
}

export const StringPatternCollection: PatternCollectionClass<string, RegExp, RegExp> = (
	arr: any = []
): PatternCollection<string, RegExp, RegExp> => {
	return {
		value: arr,
		join: function (x = StringPattern()) {
			return StringPattern(arr.map((x: Pattern) => x.value).join(x.value))
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
		concat: stringPatternCollectionConcat,
		map: stringPatternCollectionMap,
		[Symbol.iterator]: iterator(arr)
	}
}

StringPattern.collection = StringPatternCollection
StringPatternCollection.is = isPatternCollection
