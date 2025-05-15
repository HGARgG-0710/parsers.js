import { object, type } from "@hgargg-0710/one"
import assert from "assert"
import type { IInternalHash } from "../../interfaces/InternalHash.js"

const { isStruct } = type

export class ObjectInternal<Type = any, DefaultType = any>
	implements IInternalHash<string, Type, DefaultType>
{
	/**
	 * Value used by `ObjectInternalHash` as a way to signal
	 * that a certain key has been removed/replaced
	 */
	static readonly MissingKey = undefined

	private ["constructor"]: new (
		object?: object,
		_default?: DefaultType
	) => this

	size: number

	readonly default: DefaultType

	get(key: string) {
		const read = this.object[key]
		return read === ObjectInternal.MissingKey ? this.default : read
	}

	set(key: string, value: Type) {
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

	constructor(private object: object = {}, _default?: DefaultType) {
		assert(isStruct(object))
		this.default = _default!
		this.size = Object.keys(object).filter(
			(x) => object[x] !== ObjectInternal.MissingKey
		).length
	}
}
