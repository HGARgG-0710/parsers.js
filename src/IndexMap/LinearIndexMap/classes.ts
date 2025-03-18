import type { array } from "@hgargg-0710/one"
import type { ILinearIndexMap } from "./interfaces.js"
import type { MapClass } from "../interfaces.js"
import type { IndexingFunction } from "src/interfaces.js"
import type { Testable } from "src/interfaces.js"
import type { Having } from "src/interfaces.js"

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

export function LinearMapClass<
	KeyType = any,
	ValueType = any,
	DefaultType = any
>(
	change?: IndexingFunction<KeyType>,
	extensions: Function[] = [],
	keyExtensions: Function[] = []
): MapClass<KeyType, ValueType, DefaultType> {
	class linearMapClass
		extends BaseLinearMap<KeyType, ValueType, DefaultType>
		implements ILinearIndexMap<KeyType, ValueType, DefaultType>
	{
		static change?: IndexingFunction<KeyType>

		static extend: <KeyType = any>(
			...f: ((...x: any[]) => any)[]
		) => MapClass<KeyType, any>

		static extendKey: <ValueType = any>(
			...f: ((x: any) => any)[]
		) => MapClass<any, ValueType>

		static keyExtensions: Function[]
		static extensions: Function[]

		constructor(
			pairsList: array.Pairs<KeyType, ValueType>,
			_default?: DefaultType
		) {
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

export const OptimizedLinearMap = LinearMapClass()

// * predoc note: ORIGINALLYS INTENDED to be used with 'InputStream' + 'byStreamBufferPos'; ADD THE SAME NOTE to the 'CharHash' [HashMap]
export const OptimizedCharMap = OptimizedLinearMap.extend<number>(charCodeAt)

export const PredicateMap: MapClass<Function> = LinearMapClass(
	(curr: Function, x: any) => curr(x)
)

export const RegExpMap: MapClass<Testable> = LinearMapClass(
	(curr: Testable, x: any) => curr.test(x)
)

export const SetMap: MapClass<Having> = LinearMapClass((curr: Having, x: any) =>
	curr.has(x)
)

export const BasicMap = LinearMapClass(equals)
