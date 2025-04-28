import { array, object, type } from "@hgargg-0710/one"
import assert from "assert"
import type { IInternalHash } from "./interfaces.js"

const { isUndefined, isArray, isStruct } = type

export class MapInternal<KeyType = any, ValueType = any, DefaultType = any>
	implements IInternalHash<KeyType, ValueType, DefaultType>
{
	["constructor"]: new (
		map?: array.Pairs<KeyType, ValueType> | Map<KeyType, ValueType>,
		_default?: DefaultType
	) => this

	private readonly map: Map<KeyType, ValueType>
	readonly default: DefaultType

	get(x: KeyType) {
		const gotten = this.map.get(x)
		return isUndefined(gotten) ? this.default : gotten
	}

	get size() {
		return this.map.size
	}

	set(key: KeyType, value: ValueType) {
		this.map.set(key, value)
		return this
	}

	delete(key: KeyType) {
		this.map.delete(key)
		return this
	}

	rekey(fromKey: KeyType, toKey: KeyType) {
		const value = this.get(fromKey)
		if (value !== this.default) {
			this.delete(fromKey)
			this.set(toKey, value as ValueType)
		}
		return this
	}

	copy() {
		return new this.constructor(this.map, this.default)
	}

	constructor(
		mapIterable: Iterable<[KeyType, ValueType]> = new Map(),
		_default?: DefaultType
	) {
		this.map = new Map(mapIterable)
		this.default = _default!
	}
}

export class ObjectInternal<Type = any, DefaultType = any>
	implements IInternalHash<string, Type, DefaultType>
{
	/**
	 * Value used by `ObjectInternalHash` as a way to signal
	 * that a certain key has been removed/replaced
	 */
	static readonly MissingKey = undefined;

	["constructor"]: new (object?: object, _default?: DefaultType) => this

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

export class ArrayInternal<Type = any, DefaultType = any>
	implements IInternalHash<number, Type, DefaultType>
{
	static readonly MissingKey = undefined;

	["constructor"]: new (array: Type[], _default: DefaultType) => this

	readonly default: DefaultType

	size: number

	set(i: number, value: Type) {
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
