import type { Deletable, Settable } from "./HashMap/interfaces.js"
import type { IndexMap, Sizeable } from "./interfaces.js"
import type { array } from "@hgargg-0710/one"

import { ProtectedPattern } from "src/Pattern/abstract.js"

import { isGoodIndex } from "../utils.js"
import { keyValuesToPairsList, table, upperBound } from "./utils.js"

import { inplace } from "@hgargg-0710/one"
const { swap } = inplace

export abstract class DelegateSizeable<
	DelegateType extends Sizeable = any
> extends ProtectedPattern<DelegateType> {
	get size() {
		return this.value.size
	}
}

export abstract class DelegateSettableSizeable<
	KeyType = any,
	ValueType = any,
	DelegateType extends Sizeable & Settable<KeyType, ValueType> = any
> extends DelegateSizeable<DelegateType> {
	set(key: KeyType, value: ValueType) {
		this.value.set(key, value)
		return this
	}
}

export abstract class DelegateDeletableSettableSizeable<
	KeyType = any,
	ValueType = any,
	DelegateType extends Deletable<DeletedType> &
		Settable<KeyType, ValueType> &
		Sizeable = any,
	DeletedType = KeyType
> extends DelegateSettableSizeable<KeyType, ValueType, DelegateType> {
	delete(key: DeletedType) {
		this.value.delete(key)
		return this
	}
}

export abstract class PreIndexMap<
	KeyType = any,
	ValueType = any,
	DefaultType = any,
	IndexGetType = any
> implements IndexMap<KeyType, ValueType, DefaultType, IndexGetType>
{
	keys: KeyType[]
	values: ValueType[]
	default: DefaultType

	abstract index(x: any): ValueType | DefaultType

	abstract getIndex(key: any): IndexGetType
	abstract delete(index: number, count?: number): any
	abstract add(index: number, ...pairs: array.Pairs<KeyType, ValueType>): any
	abstract replace(index: number, pair: [KeyType, ValueType]): any
	abstract replaceKey(keyFrom: KeyType, keyTo: KeyType): any
	abstract copy(): IndexMap<KeyType, ValueType, DefaultType, IndexGetType>
	abstract unique(start?: boolean): number[]
	abstract byIndex(index: number): DefaultType | [KeyType, ValueType]
	abstract swap(i: number, j: number): any

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
		if (isGoodIndex(keyIndex)) {
			this.values[keyIndex] = value
			return this
		}
		return this.add(index, [key, value])
	}
}

export abstract class BaseIndexMap<
	KeyType = any,
	ValueType = any,
	DefaultType = any,
	IndexGetType = any
> extends PreIndexMap<KeyType, ValueType, DefaultType, IndexGetType> {
	["constructor"]: new (
		pairs: array.Pairs<KeyType, ValueType>,
		_default: DefaultType
	) => IndexMap<KeyType, ValueType, DefaultType, IndexGetType>

	copy() {
		return new this.constructor(keyValuesToPairsList(table(this)), this.default)
	}

	unique(start: boolean = true) {
		const uniqueKeys = new Set()
		const indexes: number[] = []

		const predicate = start ? upperBound(this) : isGoodIndex
		const change = (-1) ** +!start

		for (let i = +!start * (this.size - 1); predicate(i); i += change) {
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

	swap(i: number, j: number): any {
		swap(this.keys, i, j)
		swap(this.values, i, j)
		return this
	}

	constructor(keys: KeyType[], values: ValueType[], _default: DefaultType) {
		super()
		this.keys = keys
		this.values = values
		this.default = _default
	}
}

export * as FastLookupTable from "./FastLookupTable/abstract.js"
export * as HashMap from "./HashMap/abstract.js"
