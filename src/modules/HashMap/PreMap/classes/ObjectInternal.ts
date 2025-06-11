import { object, type } from "@hgargg-0710/one"
import assert from "assert"
import type { IPreMap } from "../../interfaces/PreMap.js"

const { isStruct } = type

export class ObjectInternal<T = any, Default = any>
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

	private set size(newSize: number) {
		this._size = newSize
	}

	get size() {
		return this._size
	}

	get(key: string) {
		const read = this.object[key]
		return read === ObjectInternal.MissingKey ? this.default : read
	}

	set(key: string, value: T) {
		if (this.object[key] === ObjectInternal.MissingKey) ++this.size
		this.object[key] = value
		return this
	}

	delete(key: string) {
		if (this.object[key] !== ObjectInternal.MissingKey) {
			--this.size
			this.object[key] = ObjectInternal.MissingKey
		}
		return this
	}

	rekey(keyFrom: string, keyTo: string) {
		this.object[keyTo] = this.object[keyFrom]
		this.object[keyFrom] = ObjectInternal.MissingKey
		return this
	}

	copy() {
		return new this.constructor(object.copy(this.object), this.default)
	}

	constructor(private object: object = {}, _default?: Default) {
		assert(isStruct(object))
		this.default = _default!
		this.size = Object.keys(object).filter(
			(x) => object[x] !== ObjectInternal.MissingKey
		).length
	}
}
