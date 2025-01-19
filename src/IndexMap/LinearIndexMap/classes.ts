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
import { fromPairsList } from "../utils.js"

import { functional, boolean } from "@hgargg-0710/one"
const { trivialCompose } = functional
const { equals } = boolean

export function LinearMapClass<KeyType = any, ValueType = any>(
	extensions: Function[],
	keyExtensions: Function[],
	change?: IndexingFunction<KeyType>
): MapClass<KeyType, ValueType> {
	class linearMapClass
		extends BaseLinearMap<KeyType, ValueType>
		implements LinearIndexMap<KeyType, ValueType>
	{
		static change?: IndexingFunction<KeyType>
		static extend: MapClassValueExtension<KeyType, ValueType>
		static extendKey: MapClassKeyExtension<KeyType, ValueType>

		static keyExtensions: Function[]
		static extensions: Function[]

		constructor(pairsList: array.Pairs<KeyType, ValueType>, _default?: any) {
			super(...fromPairsList(pairsList), _default)
		}
	}

	linearMapClass.prototype.extension = trivialCompose(...extensions)
	linearMapClass.prototype.keyExtension = trivialCompose(...keyExtensions)
	linearMapClass.prototype.change = change

	linearMapClass.extensions = extensions
	linearMapClass.keyExtensions = keyExtensions
	linearMapClass.change = change
	linearMapClass.extend = extend<KeyType>
	linearMapClass.extendKey = extendKey<KeyType, ValueType>

	if (!change)
		linearMapClass.prototype.getIndex = OptimizedLinearMapMethods.optimize<
			KeyType,
			ValueType
		>

	return linearMapClass
}

export const OptimizedLinearMap = LinearMapClass([], [])

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
