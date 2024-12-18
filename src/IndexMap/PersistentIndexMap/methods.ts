import type { Pointer as PointerType } from "../../Pattern/interfaces.js"
import type { Pairs } from "../interfaces.js"

import { BadIndex } from "../../constants.js"
import { isGoodIndex } from "../../utils.js"
import { Pointer, PersistentIndexMap } from "./classes.js"

import { inplace } from "@hgargg-0710/one"
import { upperBound } from "../utils.js"
const { insert } = inplace

export function persistentIndexMapAdd<KeyType = any, ValueType = any>(
	this: PersistentIndexMap<KeyType, ValueType>,
	index: number,
	...pairs: Pairs<KeyType, ValueType>
) {
	const increase = pairs.length
	const size = this.size
	for (let i = index; i < size; ++i) this.indexes[i].value += increase
	insert(this.indexes, index, ...pairs.map((_x, i) => Pointer(i + index)))
	this.value.add(index, ...pairs)
	return this
}

export function persistentIndexMapDelete<KeyType = any, ValueType = any>(
	this: PersistentIndexMap<KeyType, ValueType>,
	index: number,
	count: number = 1
) {
	const size = this.size
	for (let i = index + count; i < size; ++i) this.indexes[i].value -= count
	this.value.delete(index, count)
	return this
}

export function persistentIndexMapUnique<KeyType = any, ValueType = any>(
	this: PersistentIndexMap<KeyType, ValueType>,
	start: boolean = true
) {
	const keySet = new Set()
	const indexSet = new Set()

	const predicate = start ? upperBound(this) : isGoodIndex
	const change = (-1) ** +!start

	for (let i = +!start * (this.size - 1); predicate(i); i += change) {
		const curr = this.keys[i]
		if (!keySet.has(curr)) {
			keySet.add(curr)
			indexSet.add(i)
		}
	}

	this.indexes = this.indexes.filter((x: PointerType<number>, i: any) => {
		if (indexSet.has(i)) return true
		x.value = BadIndex // invalidating the deleted Pointer-s
	})

	let i = this.size
	while (i--) this.values[i][0].value = i

	this.value.unique(start)
	return this
}

export function persistentIndexMapSwap<KeyType = any, ValueType = any>(
	this: PersistentIndexMap<KeyType, ValueType>,
	i: number,
	j: number
) {
	// * Swap values
	const tempInt = this.indexes[i].value
	this.indexes[i].value = this.indexes[j].value
	this.indexes[j].value = tempInt

	// * Swap '.indexes'-locations
	const tempObj = this.indexes[i]
	this.indexes[i] = this.indexes[j]
	this.indexes[j] = tempObj

	this.value.swap(i, j)
	return this
}

export function persistentIndexMapGetIndex<KeyType = any, ValueType = any>(
	this: PersistentIndexMap<KeyType, ValueType>,
	key: KeyType
) {
	return this.indexes[this.value.getIndex(key)]
}
