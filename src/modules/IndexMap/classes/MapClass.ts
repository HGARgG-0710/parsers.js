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
import { BadIndex } from "../../../constants.js"
import type {
	IHaving,
	IIndexingFunction,
	ITestable
} from "../../../interfaces.js"
import type { IIndexMap, IMapClass } from "../../../interfaces/IndexMap.js"
import { BaseIndexMap } from "../../../internal/IndexMap.js"
import { Pairs } from "../../../samples.js"
import { isGoodIndex } from "../../../utils.js"

const { isArray } = type
const { trivialCompose } = functional
const { equals } = boolean
const { insert, out } = inplace

function plainGetIndex<KeyType = any, ValueType = any>(
	this: IIndexMap<KeyType, ValueType>,
	key: any
) {
	return (this as any).alteredKeys.indexOf(key)
}

function extend<KeyType = any, ValueType = any>(
	this: IMapClass<KeyType, ValueType>,
	...f: ((x: ValueType) => any)[]
) {
	return MapClass<KeyType>(
		this.change,
		this.extensions.concat(f),
		this.keyExtensions
	)
}

function extendKey<KeyType = any, ValueType = any>(
	this: IMapClass<KeyType, ValueType>,
	...f: ((x: any) => KeyType)[]
) {
	return MapClass<any, ValueType>(
		this.change,
		this.extensions,
		this.keyExtensions.concat(f)
	)
}

export function MapClass<KeyType = any, ValueType = any, DefaultType = any>(
	change?: IIndexingFunction<KeyType>,
	extensions: Function[] = [],
	keyExtensions: Function[] = []
): IMapClass<KeyType, ValueType, DefaultType> {
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
			if (isGoodIndex(index) && index < this.size) {
				const [key, value] = pair
				this.keys[index] = key
				this.alteredKeys[index] = keyExtension(key, index, this.keys)
				this.values[index] = value
			}
			return this
		}

		add(index: number, ...pairs: array.Pairs<KeyType, ValueType>) {
			const [keys, values] = Pairs.from(pairs)
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
			const [keys, values] = Pairs.from(pairsList)
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
		linearMapClass.prototype.getIndex = plainGetIndex<KeyType, ValueType>

	return linearMapClass
}

export const ArrayMap = MapClass(array.recursiveSame)

export const OptimizedMap = MapClass()

// * predoc note: ORIGINALLYS INTENDED to be used with 'InputStream' + 'byStreamBufferPos'; ADD THE SAME NOTE to the 'CharHash' [HashMap]
export const OptimizedCharMap = OptimizedMap.extend<number>(string.charCodeAt)

export const PredicateMap: IMapClass<Function> = MapClass(
	(curr: Function, x: any) => curr(x)
)

export const RegExpMap: IMapClass<ITestable> = MapClass(
	(curr: ITestable, x: any) => curr.test(x)
)

export const SetMap: IMapClass<IHaving> = MapClass((curr: IHaving, x: any) =>
	curr.has(x)
)

export const BasicMap = MapClass(equals)

export const ObjectMap = MapClass(object.same)
