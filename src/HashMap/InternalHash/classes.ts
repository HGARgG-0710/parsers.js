import type { IInternalHash } from "./interfaces.js"
import type { array } from "@hgargg-0710/one"

import { DelegateDeletableSettableSizeable } from "src/internal/delegates/DeletableSettable.js"
import { ProtectedPattern } from "src/internal/Pattern.js"

import { type, object } from "@hgargg-0710/one"
const { isUndefined } = type

export class MapInternalHash<KeyType = any, ValueType = any, DefaultType = any>
	extends DelegateDeletableSettableSizeable<
		KeyType,
		ValueType,
		Map<KeyType, ValueType>
	>
	implements IInternalHash<KeyType, ValueType, DefaultType>
{
	["constructor"]: new (
		map?: array.Pairs<KeyType, ValueType> | Map<KeyType, ValueType>,
		_default?: DefaultType
	) => MapInternalHash<KeyType, ValueType, DefaultType>

	readonly default: DefaultType

	get(x: KeyType) {
		const gotten = this.value.get(x)
		return isUndefined(gotten) ? this.default : gotten
	}

	rekey(fromKey: KeyType, toKey: KeyType) {
		const value = this.get(fromKey)
		this.delete(fromKey)
		this.set(toKey, value)
		return this
	}

	copy() {
		return new this.constructor(this.value, this.default)
	}

	constructor(map: Iterable<[KeyType, ValueType]>, _default?: DefaultType) {
		super(new Map(map))
		this.default = _default!
	}
}

export class ObjectInternalHash<Type = any, DefaultType = any>
	extends ProtectedPattern<object>
	implements IInternalHash<string, Type, DefaultType>
{
	/**
	 * Value used by `ObjectInternalHash` as a way to signal
	 * that a certain key has been removed/replaced
	 */
	static readonly MissingKey = undefined;

	["constructor"]: new (
		object?: object,
		_default?: DefaultType
	) => ObjectInternalHash<Type, DefaultType>

	size: number

	readonly default: DefaultType

	get(key: string) {
		const read = this.value[key]
		return read === ObjectInternalHash.MissingKey ? this.default : read
	}

	set(key: string, value: Type) {
		if (this.value[key] === ObjectInternalHash.MissingKey) ++this.size
		this.value[key] = value
		return this
	}

	delete(key: string) {
		if (this.value[key] !== ObjectInternalHash.MissingKey) {
			--this.size
			this.value[key] = ObjectInternalHash.MissingKey
		}
		return this
	}

	rekey(keyFrom: string, keyTo: string) {
		this.value[keyTo] = this.value[keyFrom]
		this.value[keyFrom] = ObjectInternalHash.MissingKey
		return this
	}

	copy() {
		return new this.constructor(object.copy(this.value), this.default)
	}

	constructor(object: object = {}, _default?: DefaultType) {
		super(object)
		this.default = _default!
		this.size = Object.keys(object).filter(
			(x) => object[x] !== ObjectInternalHash.MissingKey
		).length
	}
}

export class ArrayInternalHash<Type = any, DefaultType = any>
	extends ProtectedPattern<Type[]>
	implements IInternalHash<number, Type, DefaultType>
{
	static readonly MissingKey = undefined;

	["constructor"]: new (
		array: Type[],
		_default: DefaultType
	) => ArrayInternalHash<Type, DefaultType>

	readonly default: DefaultType

	size: number

	set(i: number, value: Type) {
		this.value[i] = value
		return this
	}

	get(i: number) {
		return this.value[i]
	}

	delete(i: number) {
		if (this.value[i] !== ArrayInternalHash.MissingKey) {
			this.value[i] = ArrayInternalHash.MissingKey as Type
			--this.size
		}
		return this
	}

	rekey(fromKey: number, toKey: number) {
		this.value[toKey] = this.value[fromKey]
		this.value[fromKey] = ArrayInternalHash.MissingKey as Type
		return this
	}

	copy() {
		return new this.constructor(this.value, this.default)
	}

	constructor(array: Type[] = [], _default?: DefaultType) {
		super(array)
		this.default = _default!
		this.size = this.value.filter(
			(x) => x !== ArrayInternalHash.MissingKey
		).length
	}
}
