import { type as _type, functional, string } from "@hgargg-0710/one"
import { type } from "../aliases/Node.js"
import type { IHash, IHashClass, IHashMap } from "../interfaces/HashMap.js"
import type { IPreMap } from "../modules/HashMap/interfaces/PreMap.js"

const { id } = functional
const { typeOf } = _type
const { charCodeAt } = string

function extend<KeyType = any, ValueType = any, InternalKeyType = any>(
	this: IHashClass<KeyType, ValueType, InternalKeyType>,
	f: (...x: any[]) => KeyType
) {
	return HashClass<any, ValueType, InternalKeyType>((...x: any[]) =>
		this.hash(f(...x))
	)
}

export function HashClass<
	KeyType = any,
	ValueType = any,
	InternalKeyType = any,
	DefaultType = any
>(
	hash: IHash<KeyType, InternalKeyType>
): IHashClass<KeyType, ValueType, InternalKeyType, DefaultType> {
	class hashClass implements IHashMap<KeyType, ValueType, DefaultType> {
		static hash: IHash<KeyType, InternalKeyType> = hash
		static extend: (
			f: (x: any) => KeyType
		) => IHashClass<KeyType, ValueType, InternalKeyType> = extend<
			KeyType,
			ValueType,
			InternalKeyType
		>

		private ["constructor"]: new (
			internal: IPreMap<InternalKeyType, ValueType>
		) => this

		get default() {
			return this.pre.default
		}

		get size() {
			return this.pre.size
		}

		index(x: KeyType, ...y: any[]) {
			return this.pre.get(hash(x, ...y))
		}

		set(key: KeyType, value: ValueType, ...y: any[]) {
			this.pre.set(hash(key, ...y), value)
			return this
		}

		delete(key: KeyType, ...y: any[]) {
			this.pre.delete(hash(key, ...y))
			return this
		}

		rekey(keyFrom: KeyType, keyTo: KeyType, ...y: any[]) {
			this.pre.rekey(hash(keyFrom, ...y), hash(keyTo, ...y))
			return this
		}

		copy() {
			return new this.constructor(this.pre.copy())
		}

		concat(pairsList: Iterable<[KeyType, ValueType]>): this {
			for (const [key, value] of pairsList) this.set(key, value)
			return this
		}

		constructor(
			private pre: IPreMap<InternalKeyType, ValueType, DefaultType>
		) {}
	}

	return hashClass
}

export const BasicHash = HashClass(id)

export const LengthHash = HashClass((x) => x.length)

export const TokenHash = HashClass(type)

export const TypeofHash = HashClass(typeOf)

export const CharHash = HashClass(charCodeAt)

export * as PreMap from "../modules/HashMap/classes/PreMap.js"
