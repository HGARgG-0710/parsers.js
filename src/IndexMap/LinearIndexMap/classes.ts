import type { array } from "@hgargg-0710/one"
import type { LinearIndexMap } from "./interfaces.js"
import type {
	IndexingFunction,
	MapClass,
	MapClassValueExtension,
	MapClassKeyExtension,
	TestType,
	HasType
} from "../interfaces.js"

import {
	extend,
	extendKey,
	OptimizedLinearMap as OptimizedLinearMapMethods
} from "./refactor.js"

import { BaseLinearMap } from "./abstract.js"
import { fromPairs } from "../utils.js"

import { functional, boolean, string } from "@hgargg-0710/one"
const { trivialCompose } = functional
const { equals } = boolean
const { charCodeAt } = string

export function LinearMapClass<KeyType = any, ValueType = any, DefaultType = any>(
	extensions: Function[],
	keyExtensions: Function[],
	change?: IndexingFunction<KeyType>
): MapClass<KeyType, ValueType, DefaultType> {
	class linearMapClass
		extends BaseLinearMap<KeyType, ValueType, DefaultType>
		implements LinearIndexMap<KeyType, ValueType, DefaultType>
	{
		static change?: IndexingFunction<KeyType>
		static extend: MapClassValueExtension
		static extendKey: MapClassKeyExtension

		static keyExtensions: Function[]
		static extensions: Function[]

		constructor(pairsList: array.Pairs<KeyType, ValueType>, _default?: DefaultType) {
			super(...fromPairs(pairsList), _default)
		}
	}

	linearMapClass.prototype.extension = trivialCompose(...extensions)
	linearMapClass.prototype.keyExtension = trivialCompose(...keyExtensions)
	linearMapClass.prototype.change = change

	linearMapClass.extensions = extensions
	linearMapClass.keyExtensions = keyExtensions
	linearMapClass.change = change
	linearMapClass.extend = extend
	linearMapClass.extendKey = extendKey

	if (!change)
		linearMapClass.prototype.getIndex = OptimizedLinearMapMethods.optimize<
			KeyType,
			ValueType
		>

	return linearMapClass
}

export const OptimizedLinearMap = LinearMapClass([], [])

// * predoc note: ORIGINALLYS INTENDED to be used with 'InputStream' + 'byStreamBufferPos'; ADD THE SAME NOTE to the 'CharHash' [HashMap]
export const OptimizedCharMap = OptimizedLinearMap.extend<number>(charCodeAt)

export const [PredicateMap, RegExpMap, SetMap, BasicMap]: [
	MapClass<Function>,
	MapClass<TestType>,
	MapClass<HasType>,
	MapClass
] = [
	(curr: Function, x: any) => curr(x),
	(curr: TestType, x: any) => curr.test(x),
	(curr: HasType, x: any) => curr.has(x),
	equals
].map((change) => LinearMapClass<any, any>([], [], change)) as [any, any, any, any]
