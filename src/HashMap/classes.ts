import { type as _type, functional, string } from "@hgargg-0710/one"
import { type } from "src/Node/utils.js"
import { length } from "../utils.js"
import type { IHash, IHashClass, IHashMap } from "./interfaces.js"
import type { IInternalHash } from "./InternalHash/interfaces.js"
import { extend } from "./refactor.js"

const { id } = functional
const { typeOf } = _type
const { charCodeAt } = string

export function HashClass<
	KeyType = any,
	ValueType = any,
	InternalKeyType = any,
	DefaultType = any
>(
	hash: IHash<KeyType, InternalKeyType>
): IHashClass<KeyType, ValueType, InternalKeyType, DefaultType> {
	class hashClass
		implements IHashMap<KeyType, ValueType, InternalKeyType, DefaultType>
	{
		static hash: IHash<KeyType, InternalKeyType> = hash
		static extend: (
			f: (x: any) => KeyType
		) => IHashClass<KeyType, ValueType, InternalKeyType> = extend<
			KeyType,
			ValueType,
			InternalKeyType
		>;

		["constructor"]: new (
			value: IInternalHash<InternalKeyType, ValueType>
		) => this

		get default() {
			return this.internal.default
		}

		get size() {
			return this.internal.size
		}

		index(x: KeyType, ...y: any[]) {
			return this.internal.get(hash(x, ...y))
		}

		set(key: KeyType, value: ValueType, ...y: any[]) {
			this.internal.set(hash(key, ...y), value)
			return this
		}

		delete(key: KeyType, ...y: any[]) {
			this.internal.delete(hash(key, ...y))
			return this
		}

		rekey(keyFrom: KeyType, keyTo: KeyType, ...y: any[]) {
			this.internal.rekey(hash(keyFrom, ...y), hash(keyTo, ...y))
			return this
		}

		copy() {
			return new this.constructor(this.internal.copy())
		}

		constructor(
			private internal: IInternalHash<
				InternalKeyType,
				ValueType,
				DefaultType
			>
		) {}
	}

	return hashClass
}

export const BasicHash = HashClass(id)

export const LengthHash = HashClass(length)

export const TokenHash = HashClass(type)

export const TypeofHash = HashClass(typeOf)

export const CharHash = HashClass(charCodeAt)

export * as InternalHash from "./InternalHash/classes.js"
