import type {
	ICopiable,
	IIndexable,
	IIndexingFunction,
	ISizeable
} from "../interfaces.js"
import type { ITableMap } from "./TableMap.js"

export interface IKeysHaving<K = any> {
	readonly keys: K[]
}

export interface IValuesHaving<V = any> {
	readonly values: V[]
}

export interface IPreIndexMap<V = any, Default = any>
	extends IIndexable<V | Default>,
		ICopiable {}

export interface IIndexMap<K = any, V = any, Default = any>
	extends IPreIndexMap<V, Default>,
		ISizeable {
	toModifiable(): ITableMap<K, V, Default>
	fromModifiable(table: ITableMap<K, V, Default>): IIndexMap<K, V, Default>
}

export interface IMapClass<K = any, V = any, Default = any> {
	new (keys?: K[], values?: V[], _default?: Default): IIndexMap<K, V, Default>
	change?: IIndexingFunction<K>
	extend: <K = any>(...f: ((...x: any[]) => any)[]) => IMapClass<K, any>
	extendKey: <V = any>(...f: ((x: any) => any)[]) => IMapClass<any, V>
	keyExtensions: Function[]
	extensions: Function[]
}
