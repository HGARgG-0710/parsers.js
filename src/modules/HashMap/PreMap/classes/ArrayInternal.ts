import { array, type } from "@hgargg-0710/one"
import assert from "assert"
import type { IPreMap } from "../../interfaces/PreMap.js"

const { isArray } = type

/**
 * This is a class implementing the `IPreMap<number, T, Default>`.
 * It is a thin wrapper around `Array`.
 * It is intended to be used by the `HashClass` for the purposes
 * of defining the hash-operations.
 */
export class ArrayInternal<T = any, Default = any>
	implements IPreMap<number, T, Default>
{
	static readonly MissingKey = undefined

	private ["constructor"]: new (array: T[], _default: Default) => this

	readonly default: Default
	private _size: number

	private set size(newSize: number) {
		this._size = newSize
	}

	get size() {
		return this._size
	}

	set(i: number, value: T) {
		if (this.array[i] === ArrayInternal.MissingKey) ++this.size
		this.array[i] = value
		return this
	}

	get(i: number) {
		return this.array[i]
	}

	delete(i: number) {
		if (this.array[i] !== ArrayInternal.MissingKey) {
			this.array[i] = ArrayInternal.MissingKey as T
			--this.size
		}
		return this
	}

	rekey(fromKey: number, toKey: number) {
		this.array[toKey] = this.array[fromKey]
		this.array[fromKey] = ArrayInternal.MissingKey as T
		return this
	}

	copy() {
		return new this.constructor(array.copy(this.array), this.default)
	}

	constructor(private array: T[] = [], _default?: Default) {
		assert(isArray(array))

		this.default = _default!
		this.size = this.array.filter(
			(x) => x !== ArrayInternal.MissingKey
		).length
	}
}
