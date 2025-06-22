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
	extends ISettable<K, V | Default>,
		IDeletable<K>,
		IRekeyable<K>,
		ISizeable,
		IDefaulting<Default>,
		ICopiable {
	get: (key: K) => V | Default
}
