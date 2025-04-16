import type { IIndexMap, IMapClass } from "../interfaces.js"
import type { IIndexingFunction } from "../../interfaces.js"
import type { array } from "@hgargg-0710/one"

export interface ILinearIndexMap<
	KeyType = any,
	ValueType = any,
	DefaulType = any
> extends IIndexMap<KeyType, ValueType, DefaulType> {
	change?: IIndexingFunction<KeyType>
	keyExtension: Function
	extension: (x: any, ...y: any[]) => any
}

export interface ILinearMapClass<
	KeyType = any,
	ValueType = any,
	DefaultType = any
> extends IMapClass<KeyType, ValueType, DefaultType> {
	new (
		map?: array.Pairs<KeyType, ValueType>,
		_default?: DefaultType
	): ILinearIndexMap<KeyType, ValueType, DefaultType>

	change?: IIndexingFunction<KeyType>

	extend: <KeyType = any>(
		...f: ((...x: any[]) => any)[]
	) => IMapClass<KeyType, any>

	extendKey: <ValueType = any>(
		...f: ((x: any) => any)[]
	) => IMapClass<any, ValueType>

	keyExtensions: Function[]
	extensions: Function[]
}
