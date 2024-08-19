import { array, object } from "@hgargg-0710/one"
import type { Summat, SummatIterable } from "./Summat.js"
const { first } = array
const { structCheck } = object

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
	extends SummatIterable {
	value: any
	join: (x: Pattern<Type, SplitType, MatchType>) => Pattern<Type, SplitType, MatchType>
	filter: (
		predicate: (x?: any, i?: number, arr?: any) => any
	) => PatternCollection<Type, SplitType, MatchType>
	reduce: (predicate: (prev?: any, curr?: any, i?: number) => any, init: any) => any
	every: (predicate: (x: any) => any) => boolean
	slice: (start: number, end: number) => PatternCollection<Type, SplitType, MatchType>
	concat: (collection: SummatIterable) => PatternCollection<Type, SplitType, MatchType>
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

export const stringPatternSplit = function (regexp: RegExp | string) {
	return StringPatternCollection(this.value.split(regexp).map(StringPattern))
}
export const stringPatternMatchAll = function (regexp: RegExp | string) {
	return StringPatternCollection(
		[...this.value.matchAll(regexp)].map(first).map(StringPattern)
	)
}

export const StringPattern: PatternClass<string, RegExp | string, RegExp | string> = (
	string = ""
): Pattern<string, RegExp | string, RegExp | string> => {
	return {
		value: string,
		split: stringPatternSplit,
		matchAll: stringPatternMatchAll,
		get length() {
			return this.value.length
		},
		class: StringPattern
	}
}
StringPattern.is = isPattern
StringPattern.empty = StringPattern()

export function stringPatternCollectionMap(f: Function) {
	return StringPatternCollection(this.value.map(f))
}
export function stringPatternCollectionConcat(collection: SummatIterable = []) {
	return StringPatternCollection([...this.value, ...collection])
}
export function stringPatternCollectionSlice(start = 0, end = this.value.length) {
	return StringPatternCollection(this.value.slice(start, end))
}
export function stringPatternCollectionEvery(predicate = (x: any): any => x) {
	return this.value.every(predicate)
}
export function stringPatternCollectionReduce(predicate: (x: any) => any, init: any) {
	return this.value.reduce(predicate, init)
}
export function stringPatternCollectionFilter(predicate = (x: any): any => x) {
	return StringPatternCollection(this.value.filter(predicate))
}
export function stringPatternCollectionJoin(x = StringPattern()) {
	return StringPattern(this.value.map((x: Pattern) => x.value).join(x.value))
}
export function* stringPatternCollectionIterator() {
	for (let i = 0; i < this.value.length; ++i) yield this.value[i]
}

export const StringPatternCollection: PatternCollectionClass<
	string,
	RegExp | string,
	RegExp | string
> = (arr: any = []): PatternCollection<string, RegExp, RegExp> => {
	return {
		value: arr,
		join: stringPatternCollectionJoin,
		filter: stringPatternCollectionFilter,
		reduce: stringPatternCollectionReduce,
		every: stringPatternCollectionEvery,
		slice: stringPatternCollectionSlice,
		concat: stringPatternCollectionConcat,
		map: stringPatternCollectionMap,
		[Symbol.iterator]: stringPatternCollectionIterator
	}
}

StringPattern.collection = StringPatternCollection
StringPatternCollection.is = isPatternCollection
