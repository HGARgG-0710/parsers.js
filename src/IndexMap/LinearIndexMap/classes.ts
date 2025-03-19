import type { array } from "@hgargg-0710/one"
import type { IIndexingFunction, ITestable, IHaving } from "../../interfaces.js"
import type { IMapClass } from "../interfaces.js"
import type { ILinearIndexMap } from "./interfaces.js"

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
	change?: IIndexingFunction<KeyType>,
	extensions: Function[] = [],
	keyExtensions: Function[] = []
): IMapClass<KeyType, ValueType, DefaultType> {
	class linearMapClass
		extends BaseLinearMap<KeyType, ValueType, DefaultType>
		implements ILinearIndexMap<KeyType, ValueType, DefaultType>
	{
		static change?: IIndexingFunction<KeyType>

		static extend: <KeyType = any>(
			...f: ((...x: any[]) => any)[]
		) => IMapClass<KeyType, any>

		static extendKey: <ValueType = any>(
			...f: ((x: any) => any)[]
		) => IMapClass<any, ValueType>

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

export const PredicateMap: IMapClass<Function> = LinearMapClass(
	(curr: Function, x: any) => curr(x)
)

export const RegExpMap: IMapClass<ITestable> = LinearMapClass(
	(curr: ITestable, x: any) => curr.test(x)
)

export const SetMap: IMapClass<IHaving> = LinearMapClass(
	(curr: IHaving, x: any) => curr.has(x)
)

export const BasicMap = LinearMapClass(equals)
