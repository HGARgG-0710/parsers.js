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

export function HashClass<K = any, V = any, InternalKey = any, Default = any>(
	hash: IHash<K, InternalKey>
): IHashClass<K, V, InternalKey, Default> {
	class hashClass implements IHashMap<K, V, Default> {
		static hash: IHash<K, InternalKey> = hash
		static extend: (f: (x: any) => K) => IHashClass<K, V, InternalKey> =
			extend<K, V, InternalKey>

		private ["constructor"]: new (internal: IPreMap<InternalKey, V>) => this

		get default() {
			return this.pre.default
		}

		get size() {
			return this.pre.size
		}

		index(x: K, ...y: any[]) {
			return this.pre.get(hash(x, ...y))
		}

		set(key: K, value: V, ...y: any[]) {
			this.pre.set(hash(key, ...y), value)
			return this
		}

		delete(key: K, ...y: any[]) {
			this.pre.delete(hash(key, ...y))
			return this
		}

		rekey(keyFrom: K, keyTo: K, ...y: any[]) {
			this.pre.rekey(hash(keyFrom, ...y), hash(keyTo, ...y))
			return this
		}

		copy() {
			return new this.constructor(this.pre.copy())
		}

		concat(pairsList: Iterable<[K, V]>): this {
			for (const [key, value] of pairsList) this.set(key, value)
			return this
		}

		constructor(private pre: IPreMap<InternalKey, V, Default>) {}
	}

	return hashClass
}

export const BasicHash = HashClass(id)

export const LengthHash = HashClass((x) => x.length)

export const TokenHash = HashClass(type)

export const TypeofHash = HashClass(typeOf)

export const CharHash = HashClass(charCodeAt)

export * as PreMap from "../modules/HashMap/classes/PreMap.js"
