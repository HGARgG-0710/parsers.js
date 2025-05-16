import { array, type } from "@hgargg-0710/one"
import assert from "assert"
import type { IPreMap } from "../../interfaces/PreMap.js"

const { isArray } = type

export class ArrayInternal<Type = any, DefaultType = any>
	implements IPreMap<number, Type, DefaultType>
{
	static readonly MissingKey = undefined

	private ["constructor"]: new (array: Type[], _default: DefaultType) => this

	readonly default: DefaultType
	private _size: number

	private set size(newSize: number) {
		this._size = newSize
	}

	get size() {
		return this._size
	}

	set(i: number, value: Type) {
		if (this.array[i] === ArrayInternal.MissingKey) ++this.size
		this.array[i] = value
		return this
	}

	get(i: number) {
		return this.array[i]
	}

	delete(i: number) {
		if (this.array[i] !== ArrayInternal.MissingKey) {
			this.array[i] = ArrayInternal.MissingKey as Type
			--this.size
		}
		return this
	}

	rekey(fromKey: number, toKey: number) {
		this.array[toKey] = this.array[fromKey]
		this.array[fromKey] = ArrayInternal.MissingKey as Type
		return this
	}

	copy() {
		return new this.constructor(array.copy(this.array), this.default)
	}

	constructor(private array: Type[] = [], _default?: DefaultType) {
		assert(isArray(array))

		this.default = _default!
		this.size = this.array.filter(
			(x) => x !== ArrayInternal.MissingKey
		).length
	}
}
