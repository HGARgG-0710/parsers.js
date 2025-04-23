import type { IInternalHash } from "./interfaces.js"

import { DelegateDeletableSettableSizeable } from "src/internal/delegates/DeletableSettable.js"
import { ProtectedPattern } from "src/internal/Pattern.js"

import { type, object, array } from "@hgargg-0710/one"
const { isUndefined } = type

export class MapInternal<KeyType = any, ValueType = any, DefaultType = any>
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
	) => MapInternal<KeyType, ValueType, DefaultType>

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

	constructor(
		map: Iterable<[KeyType, ValueType]> = new Map(),
		_default?: DefaultType
	) {
		super(new Map(map))
		this.default = _default!
	}
}

export class ObjectInternal<Type = any, DefaultType = any>
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
	) => ObjectInternal<Type, DefaultType>

	size: number

	readonly default: DefaultType

	get(key: string) {
		const read = this.value[key]
		return read === ObjectInternal.MissingKey ? this.default : read
	}

	set(key: string, value: Type) {
		if (this.value[key] === ObjectInternal.MissingKey) ++this.size
		this.value[key] = value
		return this
	}

	delete(key: string) {
		if (this.value[key] !== ObjectInternal.MissingKey) {
			--this.size
			this.value[key] = ObjectInternal.MissingKey
		}
		return this
	}

	rekey(keyFrom: string, keyTo: string) {
		this.value[keyTo] = this.value[keyFrom]
		this.value[keyFrom] = ObjectInternal.MissingKey
		return this
	}

	copy() {
		return new this.constructor(object.copy(this.value), this.default)
	}

	constructor(object: object = {}, _default?: DefaultType) {
		super(object)
		this.default = _default!
		this.size = Object.keys(object).filter(
			(x) => object[x] !== ObjectInternal.MissingKey
		).length
	}
}

export class ArrayInternal<Type = any, DefaultType = any>
	extends ProtectedPattern<Type[]>
	implements IInternalHash<number, Type, DefaultType>
{
	static readonly MissingKey = undefined;

	["constructor"]: new (
		array: Type[],
		_default: DefaultType
	) => ArrayInternal<Type, DefaultType>

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
		if (this.value[i] !== ArrayInternal.MissingKey) {
			this.value[i] = ArrayInternal.MissingKey as Type
			--this.size
		}
		return this
	}

	rekey(fromKey: number, toKey: number) {
		this.value[toKey] = this.value[fromKey]
		this.value[fromKey] = ArrayInternal.MissingKey as Type
		return this
	}

	copy() {
		return new this.constructor(array.copy(this.value), this.default)
	}

	constructor(array: Type[] = [], _default?: DefaultType) {
		super(array)
		this.default = _default!
		this.size = this.value.filter(
			(x) => x !== ArrayInternal.MissingKey
		).length
	}
}
