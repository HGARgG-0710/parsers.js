import { array } from "@hgargg-0710/one"
import { DelegateIndexMap } from "../../internal/IndexMap.js"
import { PointerArray } from "../../internal/PointerArray.js"
import { isGoodIndex } from "../../utils.js"
import type { IIndexMap } from "../interfaces.js"
import type { IPersistentIndexMap } from "./interfaces.js"
import { IndexPointer } from "../../classes.js"

export class PersistentIndexMap<
		KeyType = any,
		ValueType = any,
		DefaultType = any
	>
	extends DelegateIndexMap<KeyType, ValueType, DefaultType, IndexPointer>
	implements IPersistentIndexMap<KeyType, ValueType, DefaultType>
{
	private readonly indexes: PointerArray;

	["constructor"]: new (
		indexMap: IIndexMap<KeyType, ValueType, DefaultType>
	) => this

	copy() {
		return new this.constructor(this.delegate.copy())
	}

	delete(index: number, count: number = 1) {
		this.indexes.remove(index, count)
		this.delegate.delete(index, count)
		return this
	}

	unique(): number[] {
		const uniqueIndexes = this.delegate.unique()
		this.indexes.filterIndexes(uniqueIndexes)
		return uniqueIndexes
	}

	swap(i: number, j: number) {
		this.indexes.swap(i, j)
		this.delegate.swap(i, j)
		return this
	}

	getIndex(key: any) {
		const foundIndex = this.delegate.getIndex(key)
		return isGoodIndex(foundIndex)
			? this.indexes.getPointer(foundIndex)
			: IndexPointer.BadPointer()
	}

	add(index: number, ...pairs: array.Pairs<KeyType, ValueType>) {
		this.indexes.insert(index, pairs.length)
		this.delegate.add(index, ...pairs)
		return this
	}

	reverse() {
		super.reverse()
		this.indexes.reverse()
		return this
	}

	constructor(indexMap: IIndexMap<KeyType, ValueType, DefaultType, number>) {
		super(indexMap)
		this.indexes = new PointerArray(indexMap.size)
	}
}
