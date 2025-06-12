import { array, inplace, type } from "@hgargg-0710/one"
import assert from "assert"
import type { IIndexMap } from "../interfaces.js"
import { Pairs } from "../samples.js"
import { isGoodIndex, table } from "../utils.js"

const { swap, out, insert } = inplace
const { isArray } = type

export abstract class BaseIndexMap<K = any, V = any, Default = any>
	implements IIndexMap<K, V, Default>
{
	protected ["constructor"]: new (
		pairs: array.Pairs<K, V>,
		_default?: Default
	) => this

	readonly default: Default

	private _keys: K[]
	private _values: V[]

	abstract index(x: any): V | Default
	abstract getIndex(key: any): number
	abstract replace(index: number, pair: [K, V]): this
	abstract rekey(keyFrom: K, keyTo: K): this

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

	protected set values(newValues: V[]) {
		this._values = newValues
	}

	protected set keys(newKeys: K[]) {
		this._keys = newKeys
	}

	get values() {
		return this._values
	}

	get keys() {
		return this._keys
	}

	get size() {
		return this.keys.length
	}

	set(key: K, value: V, index: number = this.size) {
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
			? ([this.keys[index], this.values[index]] as [K, V])
			: this.default
	}

	swap(i: number, j: number) {
		swap(this.keys, i, j)
		swap(this.values, i, j)
		return this
	}

	concat(x: Iterable<[K, V]>) {
		const kv = Pairs.from(x)
		const [newKeys, newValues] = kv
		this.keys.push(...newKeys)
		this.values.push(...newValues)
		return kv
	}

	add(index: number, ...pairs: array.Pairs<K, V>) {
		const kv = Pairs.from(pairs)
		const [keys, values] = kv
		insert(this.keys, index, ...keys)
		insert(this.values, index, ...values)
		return kv
	}

	delete(index: number, count: number = 1) {
		out(this.keys, index, count)
		out(this.values, index, count)
		return this
	}

	copy() {
		return new this.constructor(Pairs.to(...table(this)), this.default)
	}

	*[Symbol.iterator]() {
		const size = this.size
		for (let i = 0; i < size; ++i)
			yield [this.keys[i], this.values[i]] as [K, V]
	}

	constructor(keys: K[], values: V[], _default?: Default) {
		assert(isArray(keys))
		assert(isArray(values))
		this.keys = keys
		this.values = values
		this.default = _default!
	}
}
