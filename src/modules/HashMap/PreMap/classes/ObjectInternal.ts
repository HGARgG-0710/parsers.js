import { object, type } from "@hgargg-0710/one"
import assert from "assert"
import type { IPreMap } from "../../interfaces/PreMap.js"

const { isStruct } = type

/**
 * This is a class implementing the `IPreMap<string, T, Default>`.
 * It is a thin `object` wrapper.
 * It is intended to be used by the `HashClass` for the purposes
 * of defining the hash-operations.
 */
export class ObjectInternal<T = any, Default = undefined>
	implements IPreMap<string, T, Default>
{
	/**
	 * Value used by `ObjectInternalHash` as a way to signal
	 * that a certain key has been removed/replaced
	 */
	static readonly MissingKey = undefined

	private ["constructor"]: new (object?: object, _default?: Default) => this

	private _size: number
	readonly default: Default

	private isMissing(
		item: T | typeof ObjectInternal.MissingKey
	): item is typeof ObjectInternal.MissingKey {
		return item === ObjectInternal.MissingKey
	}

	private isMissingKey(key: string) {
		return this.isMissing(this.object[key])
	}

	private ensureDefault(read: T | typeof ObjectInternal.MissingKey) {
		return this.isMissing(read) ? this.default : read
	}

	private set size(newSize: number) {
		this._size = newSize
	}

	get size() {
		return this._size
	}

	get(key: string) {
		return this.ensureDefault(this.object[key])
	}

	set(key: string, value: T) {
		if (this.isMissingKey(key)) ++this.size
		this.object[key] = value
		return this
	}

	delete(key: string) {
		if (!this.isMissingKey(key)) {
			--this.size
			this.object[key] = ObjectInternal.MissingKey
		}
		return this
	}

	rekey(keyFrom: string, keyTo: string) {
		if (keyFrom !== keyTo) {
			this.object[keyTo] = this.object[keyFrom]
			this.object[keyFrom] = ObjectInternal.MissingKey
		}
		return this
	}

	copy() {
		return new this.constructor(object.copy(this.object), this.default)
	}

	constructor(private readonly object: object = {}, _default?: Default) {
		assert(isStruct(object))
		this.default = _default!
		this.size = Object.keys(object).filter(
			(x) => object[x] !== ObjectInternal.MissingKey
		).length
	}
}
