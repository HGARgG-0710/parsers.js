import {
	array,
	boolean,
	functional,
	object,
	string,
	type
} from "@hgargg-0710/one"
import { BaseLinearMap } from "src/internal/LinearIndexMap.js"
import type { IHaving, IIndexingFunction, ITestable } from "../../interfaces.js"
import { Autocache } from "../../internal/Autocache.js"
import type { IMapClass } from "../interfaces.js"
import { fromPairs } from "../utils.js"
import type { ILinearIndexMap, ILinearMapClass } from "./interfaces.js"
import {
	extend,
	extendKey,
	OptimizedLinearMap as OptimizedLinearMapMethods
} from "./refactor.js"
import assert from "assert"

const { isArray } = type
const { trivialCompose } = functional
const { equals } = boolean

function makeLinearMapClass<KeyType = any, ValueType = any, DefaultType = any>(
	change?: IIndexingFunction<KeyType>,
	extensions: Function[] = [],
	keyExtensions: Function[] = []
): ILinearMapClass<KeyType, ValueType, DefaultType> {
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
			pairsList: array.Pairs<KeyType, ValueType> = [],
			_default?: DefaultType
		) {
			assert(isArray(pairsList))
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

export const ArrayMap = makeLinearMapClass(array.recursiveSame)

const linMapClassCacher = ([change, extensions, keyExtensions]) =>
	makeLinearMapClass(change, extensions, keyExtensions)

const _LinearMapClass = new Autocache(
	new ArrayMap([[[array.recursiveSame, [], []], ArrayMap]]),
	linMapClassCacher
)

export function LinearMapClass<
	KeyType = any,
	ValueType = any,
	DefaultType = any
>(
	change?: IIndexingFunction<KeyType>,
	extensions: Function[] = [],
	keyExtensions: Function[] = []
): ILinearMapClass<KeyType, ValueType, DefaultType> {
	return _LinearMapClass([change, extensions, keyExtensions])
}

export const OptimizedLinearMap = LinearMapClass()

// * predoc note: ORIGINALLYS INTENDED to be used with 'InputStream' + 'byStreamBufferPos'; ADD THE SAME NOTE to the 'CharHash' [HashMap]
export const OptimizedCharMap = OptimizedLinearMap.extend<number>(
	string.charCodeAt
)

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

export const ObjectMap = LinearMapClass(object.same)
