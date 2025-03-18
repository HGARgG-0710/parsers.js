import type { IndexingFunction } from "src/interfaces.js"
import type { array } from "@hgargg-0710/one"

import { isGoodIndex } from "src/utils.js"
import { fromPairs } from "../utils.js"
import { inBound } from "../refactor.js"

import { BadIndex } from "../../constants.js"
import { BaseIndexMap } from "../abstract.js"

import { inplace } from "@hgargg-0710/one"
const { insert, out } = inplace

export abstract class BaseLinearMap<
	KeyType = any,
	ValueType = any,
	DefaultType = any
> extends BaseIndexMap<KeyType, ValueType, DefaultType> {
	protected alteredKeys: any[]

	change?: IndexingFunction<KeyType>

	extension: (x: any, ...y: any[]) => any
	keyExtension: (value: KeyType, index?: number, array?: KeyType[]) => any

	index(x: any, ...y: any[]) {
		const valueIndex = this.getIndex(this.extension(x, ...y))
		return isGoodIndex(valueIndex) ? this.values[valueIndex] : this.default
	}

	replace(index: number, pair: [KeyType, ValueType]) {
		if (inBound(index, this)) {
			const [key, value] = pair
			this.keys[index] = key
			this.alteredKeys[index] = this.keyExtension(key, index, this.keys)
			this.values[index] = value
		}
		return this
	}

	add(index: number, ...pairs: array.Pairs<KeyType, ValueType>) {
		const [keys, values] = fromPairs(pairs)
		insert(this.keys, index, ...keys)
		insert(
			this.alteredKeys,
			index,
			...keys.map((x) => this.keyExtension(x))
		)
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
		this.alteredKeys[replacementIndex] = this.keyExtension(keyTo)
		return this
	}

	getIndex(sought: any) {
		const size = this.size
		for (let i = 0; i < size; ++i)
			if (this.change!(this.alteredKeys[i], sought)) return i
		return BadIndex
	}

	unique() {
		const indexes = super.unique()
		this.alteredKeys = indexes.map((x) => this.alteredKeys[x])
		return indexes
	}

	constructor(keys: KeyType[], values: ValueType[], _default?: DefaultType) {
		super(keys, values, _default)
		this.alteredKeys = this.keys.map(this.keyExtension)
	}
}
