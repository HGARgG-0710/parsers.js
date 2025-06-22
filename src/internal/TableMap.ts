import { array, inplace, type } from "@hgargg-0710/one"
import assert from "assert"
import type { ITableMap } from "../interfaces/TableMap.js"
import { Pairs } from "../samples.js"
import { isGoodIndex } from "../utils.js"

const { isArray } = type
const { insert, out, swap } = inplace

/**
 * This is a class implementing the `ITableMap<K, V, Default>`. 
 * It permits the user to make necessary changes to a key-value 
 * table, as well as introspect its contents via `.read`, 
 * or directly via the `readonly .keys/.values` properies. 
 * 
 * It is the one used by the `MapClass` classes' instances.
*/
export class TableMap<K = any, V = any, Default = any>
	implements ITableMap<K, V, Default>
{
	protected ["constructor"]: new (
		keys: K[],
		values: V[],
		_default?: Default
	) => this

	readonly default: Default
	private _keys: K[]
	private _values: V[]

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

	private rekeyIfGoodIndex(index: number, to: K) {
		if (isGoodIndex(index)) this.keys[index] = to
	}

	private set values(newValues: V[]) {
		this._values = newValues
	}

	private set keys(newKeys: K[]) {
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
		return keyIndex
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

	read(index: number) {
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

	replace(index: number, pair: [K, V]) {
		if (isGoodIndex(index) && index < this.size) {
			const [key, value] = pair
			this.keys[index] = key
			this.values[index] = value
		}
		return this
	}

	rekey(from: K, to: K) {
		this.rekeyIfGoodIndex(this.keys.indexOf(from), to)
		return this
	}

	copy() {
		return new this.constructor(this.keys, this.values, this.default)
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
