import type {
	IConcattable,
	ICopiable,
	IDefaulting,
	IDeletable,
	IHashable,
	IIndexable,
	IRekeyable,
	ISettable,
	ISizeable
} from "../interfaces.js"
import type { IPreMap } from "../modules/HashMap/interfaces/PreMap.js"

export type IHash<K = any, InternalKey = any> = (
	x: K,
	...y: any[]
) => InternalKey

export interface IHashClass<K = any, V = any, InternalKey = any, Default = any>
	extends IHashable<K, InternalKey> {
	new (structure: IPreMap<InternalKey, V, Default>): IHashMap<K, V, Default>
	extend: (f: (x: any) => K) => IHashClass<any, V, InternalKey>
}

export interface IHashMap<K = any, V = any, Default = any>
	extends IIndexable<V | Default>,
		ISettable<K, V | Default>,
		IDeletable<K>,
		IRekeyable<K>,
		ISizeable,
		IDefaulting,
		IConcattable<Iterable<[K, V]>, IHashMap<K, V, Default>>,
		ICopiable {}

export type * from "../modules/HashMap/interfaces/PreMap.js"
