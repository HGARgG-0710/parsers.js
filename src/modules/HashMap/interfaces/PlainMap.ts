import type {
	ICopiable,
	IDefaulting,
	IDeletable,
	IRekeyable,
	ISettable,
	ISizeable
} from "../../../interfaces.js"

/**
 * This is an interface existing for the purpose of
 * having the operations of instances of the `HashClass`
 * classes redirected to. It allows one to get the size
 * of the underlying `IHashMap` representation in question,
 * delete an item, set a (possibly missing) item, has a
 * `readonly default: Default` property, and can have its
 * values changing keys (via `.rekey(from: K, to: K)`).
 */
export interface IPreMap<K = any, V = any, Default = any>
	extends ISettable<K, V>,
		IDeletable<K>,
		IRekeyable<K>,
		ISizeable,
		IDefaulting<Default>,
		ICopiable {
	get: (key: K) => V | Default
}

/**
 * Represents a barebone wrapper around some read-write
 * data structure capable of "annuling" its keys, as well
 * as returning an iterator of its values at "good" *and*
 * "bad" keys via the `.values()` method.
 */
export interface IPlainMap<K = any, V = any> extends ICopiable {
	write(key: K, value: V): void
	read(key: K): V | undefined
	annul(key: K): void
	values(): IteratorObject<V | undefined>
}
