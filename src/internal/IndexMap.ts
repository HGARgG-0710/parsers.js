import { array, inplace, type } from "@hgargg-0710/one"
import assert from "assert"
import { table, toPairs } from "../IndexMap/utils.js"
import type { IIndexMap } from "../interfaces.js"
import { isGoodIndex } from "../utils.js"

const { swap } = inplace
const { isArray } = type

abstract class PreIndexMap<
	KeyType = any,
	ValueType = any,
	DefaultType = any,
	IndexGetType = any
> implements IIndexMap<KeyType, ValueType, DefaultType, IndexGetType>
{
	abstract keys: KeyType[]
	abstract values: ValueType[]
	abstract default: DefaultType

	abstract index(x: any): ValueType | DefaultType

	abstract getIndex(key: any): IndexGetType
	abstract delete(index: number, count?: number): this
	abstract add(index: number, ...pairs: array.Pairs<KeyType, ValueType>): this
	abstract replace(index: number, pair: [KeyType, ValueType]): this
	abstract rekey(keyFrom: KeyType, keyTo: KeyType): this
	abstract copy(): this
	abstract unique(): number[]
	abstract byIndex(index: number): DefaultType | [KeyType, ValueType]
	abstract swap(i: number, j: number): this

	get size() {
		return this.keys.length
	}

	*[Symbol.iterator]() {
		const size = this.size
		for (let i = 0; i < size; ++i)
			yield [this.keys[i], this.values[i]] as [KeyType, ValueType]
	}

	set(key: KeyType, value: ValueType, index: number = this.size) {
		const keyIndex = this.keys.indexOf(key)
		if (isGoodIndex(keyIndex)) this.values[keyIndex] = value
		else this.add(index, [key, value])
		return this
	}

	reverse() {
		this.keys.reverse()
		this.values.reverse()
		return this
	}
}

export abstract class BaseIndexMap<
	KeyType = any,
	ValueType = any,
	DefaultType = any,
	IndexGetType = any
> extends PreIndexMap<KeyType, ValueType, DefaultType, IndexGetType> {
	public default: DefaultType;

	["constructor"]: new (
		pairs: array.Pairs<KeyType, ValueType>,
		_default?: DefaultType
	) => IIndexMap<KeyType, ValueType, DefaultType, IndexGetType>

	copy() {
		return new this.constructor(toPairs(table(this)), this.default)
	}

	unique() {
		const uniqueKeys = new Set()
		const indexes: number[] = []

		for (let i = 0; i < this.size; ++i) {
			const curr = this.keys[i]
			if (!uniqueKeys.has(curr)) {
				uniqueKeys.add(curr)
				indexes.push(i)
			}
		}

		this.keys = indexes.map((x) => this.keys[x])
		this.values = indexes.map((x) => this.values[x])

		return indexes
	}

	byIndex(index: number) {
		return isGoodIndex(index) && this.size > index
			? ([this.keys[index], this.values[index]] as [KeyType, ValueType])
			: this.default
	}

	swap(i: number, j: number) {
		swap(this.keys, i, j)
		swap(this.values, i, j)
		return this
	}

	constructor(
		public keys: KeyType[],
		public values: ValueType[],
		_default?: DefaultType
	) {
		assert(isArray(keys))
		assert(isArray(values))

		super()
		this.default = _default!
	}
}

export abstract class DelegateIndexMap<
	KeyType = any,
	ValueType = any,
	DefaultType = any,
	IndexGetType = any
> extends PreIndexMap<KeyType, ValueType, DefaultType, IndexGetType> {
	protected delegate: IIndexMap<KeyType, ValueType, any, number>

	rekey(keyFrom: KeyType, keyTo: KeyType) {
		this.delegate.rekey(keyFrom, keyTo)
		return this
	}

	index(x: any, ...y: any[]) {
		return this.delegate.index(x, ...y)
	}

	byIndex(index: number) {
		return this.delegate.byIndex(index)
	}

	replace(index: number, pair: [KeyType, ValueType]) {
		this.delegate.replace(index, pair)
		return this
	}

	get default() {
		return this.delegate.default
	}

	get values() {
		return this.delegate.values
	}

	get keys() {
		return this.delegate.keys
	}

	constructor(value: IIndexMap<KeyType, ValueType, any, number>) {
		super()
		this.delegate = value
	}
}
