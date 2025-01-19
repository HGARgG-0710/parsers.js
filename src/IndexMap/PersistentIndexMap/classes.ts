import type { Pointer as PointerType } from "../../Pattern/interfaces.js"
import type { IndexMap } from "../interfaces.js"
import type { PersistentIndexMap as PersistentIndexMapType } from "./interfaces.js"
import type { array } from "@hgargg-0710/one"

import { BadIndex } from "../../constants.js"

import { setValue, swapValues } from "../../Pattern/utils.js"
import { DelegateIndexMap } from "./abstract.js"

import { inplace } from "@hgargg-0710/one"
const { mutate, swap, insert, out } = inplace

// * Explanation: objects are passed by reference, ergo, it's possible to keep the
// * 	index of a 'PersistentIndexMap' consistent across multiple sources,
// * 	via wrapping it into a one-property object;
export const Pointer = <Type = any>(value: Type): PointerType<Type> => ({ value })

export class PersistentIndexMap<KeyType = any, ValueType = any, DefaultType = any>
	extends DelegateIndexMap<KeyType, ValueType, DefaultType, PointerType<number>>
	implements PersistentIndexMapType<KeyType, ValueType, DefaultType>
{
	indexes: PointerType<number>[]

	static invalidateIndex(indexPointer: PointerType<number>) {
		setValue(indexPointer, BadIndex)
	}

	["constructor"]: new (
		indexMap: IndexMap<KeyType, ValueType, DefaultType>
	) => PersistentIndexMap<KeyType, ValueType, DefaultType>

	copy() {
		return new this.constructor(this.value)
	}

	delete(index: number, count: number = 1) {
		const size = this.size
		for (let i = index + count; i < size; ++i) this.indexes[i].value -= count
		out(this.indexes, index, count)
		this.value.delete(index, count)
		return this
	}

	unique(start?: boolean): number[] {
		const indexes = this.value.unique(start)
		const indexSet = new Set(indexes)

		this.indexes = this.indexes.filter((x: PointerType<number>, i: any) => {
			if (indexSet.has(i)) return true
			PersistentIndexMap.invalidateIndex(x)
		})

		this.repairIndexes()
		return indexes
	}

	swap(i: number, j: number) {
		swapValues(this.indexes[i], this.indexes[j])
		swap(this.indexes, i, j)
		this.value.swap(i, j)
		return this
	}

	getIndex(key: any) {
		return this.indexes[this.value.getIndex(key)]
	}

	add(index: number, ...pairs: array.Pairs<KeyType, ValueType>) {
		const increase = pairs.length
		const size = this.size
		for (let i = index; i < size; ++i) this.indexes[i].value += increase
		insert(this.indexes, index, ...pairs.map((_x, i) => Pointer(i + index)))
		this.value.add(index, ...pairs)
		return this
	}

	repairIndexes() {
		let i = this.size
		while (i--) this.indexes[i].value = i
	}

	constructor(indexMap: IndexMap<KeyType, ValueType, DefaultType, number>) {
		super(indexMap)
		mutate((this.indexes = new Array(indexMap.size)), (_x, i) => Pointer(i))
	}
}
