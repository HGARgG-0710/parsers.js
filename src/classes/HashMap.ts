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

abstract class PreHashClass<K = any, V = any, InternalKey = any, Default = any>
	implements IHashMap<K, V, Default>
{
	private ["constructor"]: new (internal: IPreMap<InternalKey, V>) => this

	private hash: IHash<K, InternalKey>

	protected setHash(hash: IHash<K, InternalKey>) {
		this.hash = hash
	}

	get default() {
		return this.pre.default
	}

	get size() {
		return this.pre.size
	}

	index(x: K, ...y: any[]) {
		return this.pre.get(this.hash(x, ...y))
	}

	set(key: K, value: V, ...y: any[]) {
		this.pre.set(this.hash(key, ...y), value)
		return this
	}

	delete(key: K, ...y: any[]) {
		this.pre.delete(this.hash(key, ...y))
		return this
	}

	rekey(keyFrom: K, keyTo: K, ...y: any[]) {
		this.pre.rekey(this.hash(keyFrom, ...y), this.hash(keyTo, ...y))
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

/**
 * This is a factory for producing `IHashClass<K, V, InternalKey, Default` objects. 
 * These are, essentially, classes/constructors for the creation of `IHashMap` objects, 
 * via the underlying `structure: IPreMap<InternalKey, V, Default>` objects. 
 * 
 * This function creates a new class on each call, its results are NOT cached automatically, 
 * so caution is advised when using it. The classes WILL be disjoint whenever using 
 * `instanceof`, although they do share a common-functionality ancestor.
 * 
 * The `IHashClass` implementation specific to this factory is such that (internally)
 * it redirects all of its calls to the `IPreMap`, by putting all the 
 * methods' arguments of type `K` through the provided `hash` argument of the respective 
 * `HashClass` call. 
*/
export function HashClass<K = any, V = any, InternalKey = any, Default = any>(
	hash: IHash<K, InternalKey>
): IHashClass<K, V, InternalKey, Default> {
	class hashClass extends PreHashClass<K, V, InternalKey, Default> {
		static hash: IHash<K, InternalKey> = hash
		static extend: (f: (x: any) => K) => IHashClass<K, V, InternalKey> =
			extend<K, V, InternalKey>

		constructor(pre: IPreMap<InternalKey, V, Default>) {
			super(pre)
			this.setHash(hash)
		}
	}
	return hashClass
}

export const BasicHash = HashClass(id)

export const LengthHash = HashClass((x) => x.length)

export const TokenHash = HashClass(type)

export const TypeofHash = HashClass(typeOf)

export const CharHash = HashClass(charCodeAt)

export * as PreMap from "../modules/HashMap/classes/PreMap.js"
