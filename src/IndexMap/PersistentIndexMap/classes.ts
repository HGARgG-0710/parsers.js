import { array, inplace } from "@hgargg-0710/one"
import type { IPointer } from "src/interfaces.js"
import { Pointer } from "../../classes.js"
import { BadIndex } from "../../constants.js"
import { DelegateIndexMap } from "../../internal/IndexMap.js"
import { isGoodIndex, setValue, swapValues } from "../../utils.js"
import type { IIndexMap } from "../interfaces.js"
import type { IPersistentIndexMap } from "./interfaces.js"

const { mutate, swap, insert, out } = inplace

export class PersistentIndexMap<
		KeyType = any,
		ValueType = any,
		DefaultType = any
	>
	extends DelegateIndexMap<KeyType, ValueType, DefaultType, IPointer<number>>
	implements IPersistentIndexMap<KeyType, ValueType, DefaultType>
{
	indexes: IPointer<number>[]

	static invalidatePointer(indexPointer: IPointer<number>) {
		setValue(indexPointer, BadIndex)
	}

	["constructor"]: new (
		indexMap: IIndexMap<KeyType, ValueType, DefaultType>
	) => PersistentIndexMap<KeyType, ValueType, DefaultType>

	copy() {
		return new this.constructor(this.delegate.copy())
	}

	delete(index: number, count: number = 1) {
		const size = this.size
		for (let i = index + count; i < size; ++i)
			this.indexes[i].value -= count
		out(this.indexes, index, count)
		this.delegate.delete(index, count)
		return this
	}

	unique(): number[] {
		const indexes = this.delegate.unique()
		const indexSet = new Set(indexes)

		this.indexes = this.indexes.filter((x: IPointer<number>, i: any) => {
			if (indexSet.has(i)) return true
			PersistentIndexMap.invalidatePointer(x)
		})

		this.repairIndexes()
		return indexes
	}

	swap(i: number, j: number) {
		swapValues(this.indexes[i], this.indexes[j])
		swap(this.indexes, i, j)
		this.delegate.swap(i, j)
		return this
	}

	getIndex(key: any) {
		const foundIndex = this.delegate.getIndex(key)
		return isGoodIndex(foundIndex)
			? this.indexes[foundIndex]
			: Pointer(BadIndex)
	}

	add(index: number, ...pairs: array.Pairs<KeyType, ValueType>) {
		const increase = pairs.length
		const size = this.size
		for (let i = index; i < size; ++i) this.indexes[i].value += increase
		insert(this.indexes, index, ...pairs.map((_x, i) => Pointer(i + index)))
		this.delegate.add(index, ...pairs)
		return this
	}

	private repairIndexes() {
		let i = this.size
		while (i--) setValue(this.indexes[i], i)
	}

	reverse() {
		super.reverse()
		this.indexes.reverse()
		this.repairIndexes()
		return this
	}

	constructor(indexMap: IIndexMap<KeyType, ValueType, DefaultType, number>) {
		super(indexMap)
		mutate((this.indexes = new Array(indexMap.size)), (_x, i) => Pointer(i))
	}
}
