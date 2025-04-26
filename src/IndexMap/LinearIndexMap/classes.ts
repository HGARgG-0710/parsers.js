import {
	array,
	boolean,
	functional,
	inplace,
	object,
	string,
	type
} from "@hgargg-0710/one"
import assert from "assert"
import { BadIndex } from "../../constants.js"
import type { IHaving, IIndexingFunction, ITestable } from "../../interfaces.js"
import { BaseIndexMap } from "../../internal/IndexMap.js"
import { isGoodIndex } from "../../utils.js"
import type { IIndexMap, IMapClass } from "../interfaces.js"
import { inBound } from "../refactor.js"
import { fromPairs } from "../utils.js"
import type { ILinearMapClass } from "./interfaces.js"
import {
	extend,
	extendKey,
	OptimizedLinearMap as OptimizedLinearMapMethods
} from "./refactor.js"

const { isArray } = type
const { trivialCompose } = functional
const { equals } = boolean
const { insert, out } = inplace

export function LinearMapClass<
	KeyType = any,
	ValueType = any,
	DefaultType = any
>(
	change?: IIndexingFunction<KeyType>,
	extensions: Function[] = [],
	keyExtensions: Function[] = []
): ILinearMapClass<KeyType, ValueType, DefaultType> {
	const extension = trivialCompose(...extensions)
	const keyExtension = trivialCompose(...keyExtensions)

	class linearMapClass
		extends BaseIndexMap<KeyType, ValueType, DefaultType>
		implements IIndexMap<KeyType, ValueType, DefaultType>
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

		private alteredKeys: any[]

		index(x: any, ...y: any[]) {
			const valueIndex = this.getIndex(extension(x, ...y))
			return isGoodIndex(valueIndex)
				? this.values[valueIndex]
				: this.default
		}

		replace(index: number, pair: [KeyType, ValueType]) {
			if (inBound(index, this)) {
				const [key, value] = pair
				this.keys[index] = key
				this.alteredKeys[index] = keyExtension(key, index, this.keys)
				this.values[index] = value
			}
			return this
		}

		add(index: number, ...pairs: array.Pairs<KeyType, ValueType>) {
			const [keys, values] = fromPairs(pairs)
			insert(this.keys, index, ...keys)
			insert(this.alteredKeys, index, ...keys.map(keyExtension))
			insert(this.values, index, ...values)
			return this
		}

		delete(index: number, count: number = 1) {
			out(this.keys, index, count)
			out(this.alteredKeys, index, count)
			out(this.values, index, count)
			return this
		}

		rekey(keyFrom: KeyType, keyTo: KeyType) {
			const replacementIndex = this.keys.indexOf(keyFrom)
			this.keys[replacementIndex] = keyTo
			this.alteredKeys[replacementIndex] = keyExtension(keyTo)
			return this
		}

		getIndex(sought: any) {
			const size = this.size
			for (let i = 0; i < size; ++i)
				if (change!(this.alteredKeys[i], sought)) return i
			return BadIndex
		}

		unique() {
			const indexes = super.unique()
			this.alteredKeys = indexes.map((x) => this.alteredKeys[x])
			return indexes
		}

		constructor(
			pairsList: array.Pairs<KeyType, ValueType> = [],
			_default?: DefaultType
		) {
			assert(isArray(pairsList))
			const [keys, values] = fromPairs(pairsList)
			super(keys, values, _default)
			this.alteredKeys = this.keys.map(keyExtension)
		}
	}

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

export const ArrayMap = LinearMapClass(array.recursiveSame)

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
