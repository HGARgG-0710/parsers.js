import { type as _type, functional, object, string } from "@hgargg-0710/one"
import { type } from "src/Node/utils.js"
import { OptimizedLinearMap } from "../IndexMap/LinearIndexMap/classes.js"
import { Autocache } from "../internal/Autocache.js"
import { length } from "../utils.js"
import type { IHash, IHashClass, IHashMap } from "./interfaces.js"
import type { IInternalHash } from "./InternalHash/interfaces.js"
import { extend } from "./refactor.js"
import { fromFlags } from "./utils.js"

const { id } = functional
const { typeOf } = _type
const { charCodeAt } = string
const { extendPrototype } = object
const { ConstDescriptor } = object.descriptor

abstract class BaseHashClass<
	KeyType = any,
	ValueType = any,
	InternalKeyType = any,
	DefaultType = any
> implements IHashMap<KeyType, ValueType, InternalKeyType, DefaultType>
{
	["constructor"]: new (
		value: IInternalHash<InternalKeyType, ValueType>
	) => IHashMap<KeyType, ValueType, InternalKeyType, DefaultType>

	hash: IHash<KeyType, InternalKeyType>

	get default() {
		return this.internal.default
	}

	get size() {
		return this.internal.size
	}

	index(x: KeyType, ...y: any[]) {
		return this.internal.get(this.hash(x, ...y))
	}

	set(key: KeyType, value: ValueType, ...y: any[]) {
		this.internal.set(this.hash(key, ...y), value)
		return this
	}

	delete(key: KeyType, ...y: any[]) {
		this.internal.delete(this.hash(key, ...y))
		return this
	}

	rekey(keyFrom: KeyType, keyTo: KeyType, ...y: any[]) {
		this.internal.rekey(this.hash(keyFrom, ...y), this.hash(keyTo, ...y))
		return this
	}

	copy() {
		return new this.constructor(this.internal.copy())
	}

	constructor(
		protected internal: IInternalHash<
			InternalKeyType,
			ValueType,
			DefaultType
		>
	) {}
}

export const HashClass = new Autocache(new OptimizedLinearMap(), function <
	KeyType = any,
	ValueType = any,
	InternalKeyType = any,
	DefaultType = any
>(hash: IHash<KeyType, InternalKeyType>) {
	class hashClass extends BaseHashClass<
		KeyType,
		ValueType,
		InternalKeyType,
		DefaultType
	> {
		static hash: IHash<KeyType, InternalKeyType> = hash
		static extend: (
			f: (x: any) => KeyType
		) => IHashClass<KeyType, ValueType, InternalKeyType> = extend<
			KeyType,
			ValueType,
			InternalKeyType
		>
	}

	extendPrototype(hashClass, {
		hash: ConstDescriptor(hash)
	})

	return hashClass
}) as unknown as <
	KeyType = any,
	ValueType = any,
	InternalKeyType = any,
	DefaultType = any
>(
	hash: IHash<KeyType, InternalKeyType>
) => IHashClass<KeyType, ValueType, InternalKeyType, DefaultType>

export const BasicHash = HashClass(id)

export const LengthHash = HashClass(length)

export const TokenHash = HashClass(type)

export const TypeofHash = HashClass(typeOf)

export const CharHash = HashClass(charCodeAt)

export const BitHash = HashClass(fromFlags)

export * as InternalHash from "./InternalHash/classes.js"

