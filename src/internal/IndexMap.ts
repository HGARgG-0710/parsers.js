import { array, inplace, type } from "@hgargg-0710/one"
import assert from "assert"
import type { IIndexMap } from "../interfaces.js"
import { isGoodIndex, table } from "../utils.js"
import { Pairs } from "../samples.js"

const { swap } = inplace
const { isArray } = type

export abstract class BaseIndexMap<
	KeyType = any,
	ValueType = any,
	DefaultType = any,
	IndexGetType = any
> implements IIndexMap<KeyType, ValueType, DefaultType, IndexGetType>
{
	protected ["constructor"]: new (
		pairs: array.Pairs<KeyType, ValueType>,
		_default?: DefaultType
	) => this

	readonly default: DefaultType

	private _keys: KeyType[]
	private _values: ValueType[]

	abstract index(x: any): ValueType | DefaultType
	abstract getIndex(key: any): IndexGetType
	abstract delete(index: number, count?: number): this
	abstract add(index: number, ...pairs: array.Pairs<KeyType, ValueType>): this
	abstract replace(index: number, pair: [KeyType, ValueType]): this
	abstract rekey(keyFrom: KeyType, keyTo: KeyType): this

	private uniqueIndexes() {
		const uniqueKeys = new Set()
		const indexes: number[] = []

		for (let i = 0; i < this.size; ++i) {
			const curr = this.keys[i]
			if (!uniqueKeys.has(curr)) {
				uniqueKeys.add(curr)
				indexes.push(i)
			}
		}

		return indexes
	}

	protected set values(newValues: ValueType[]) {
		this._values = newValues
	}

	get values() {
		return this._values
	}

	protected set keys(newKeys: KeyType[]) {
		this._keys = newKeys
	}

	get keys() {
		return this._keys
	}

	get size() {
		return this.keys.length
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

	unique() {
		const indexes = this.uniqueIndexes()
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

	copy() {
		return new this.constructor(Pairs.to(...table(this)), this.default)
	}

	*[Symbol.iterator]() {
		const size = this.size
		for (let i = 0; i < size; ++i)
			yield [this.keys[i], this.values[i]] as [KeyType, ValueType]
	}

	constructor(keys: KeyType[], values: ValueType[], _default?: DefaultType) {
		assert(isArray(keys))
		assert(isArray(values))
		this.keys = keys
		this.values = values
		this.default = _default!
	}
}
