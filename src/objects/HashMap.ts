import { type as _type, functional } from "@hgargg-0710/one"
import type { IStream } from "../interfaces.js"
import type { IHash, IHashClass, IHashMap } from "../interfaces/HashMap.js"
import type { IPreMap } from "../modules/HashMap/interfaces/PlainMap.js"
import { type } from "../utils/Node.js"
import { curr, peek } from "../utils/Stream.js"

const { id } = functional
const { typeOf } = _type

function mapClassExtend<
	NK = any,
	K = any,
	V = any,
	InternalKey = any,
	Default = any
>(f: (y: NK, ...x: any[]) => K, hash: IHash<K, InternalKey>) {
	return HashClass<NK, V, InternalKey, Default>((key: NK, ...other: any[]) =>
		hash(f(key, ...other))
	)
}

abstract class PreHashClass<
	K = any,
	V = any,
	InternalKey = any,
	Default = any
> implements IHashMap<K, V, Default> {
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

	get(key: K): V | Default {
		return this.pre.get(this.hash(key))
	}

	concat(pairsList: Iterable<[K, V]>): this {
		for (const [key, value] of pairsList) this.set(key, value)
		return this
	}

	constructor(private readonly pre: IPreMap<InternalKey, V, Default>) {}
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
		static readonly hash: IHash<K, InternalKey> = hash
		static extend<NK = any>(f: (y: NK, ...x: any[]) => K) {
			return mapClassExtend<NK, K, V, InternalKey, Default>(f, hash)
		}

		constructor(pre: IPreMap<InternalKey, V, Default>) {
			super(pre)
			this.setHash(hash)
		}
	}
	return hashClass
}

/**
 * This is an `HashClass((x) => x)`.
 * The most basic kind of `IHashClass` that there can be.
 */
export const BasicHash = HashClass(id)

/**
 * This is a `HashClass((x: IStream) => x.curr)`
 */
export const CurrentHash = HashClass<IStream>(curr)

/**
 * This is a  `HashClass((x) => x.length)`
 */
export const LengthHash = HashClass((x) => x.length)

/**
 * This is a `HashClass((x) => x.type)`
 */
export const TokenHash = HashClass(type)

/**
 * This is a `HashClass((x) => typeof x)`
 */
export const TypeofHash = HashClass(typeOf)

export const PeekHash = <K = any, V = any, InternalKey = any, Default = any>(
	hashClass: IHashClass<K, V, InternalKey, Default>
) => hashClass.extend(peek(1))

export * as PlainMap from "../modules/HashMap/objects/PlainMap.js"
export * from "../modules/HashMap/objects/TerminalMap.js"
