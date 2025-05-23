import type { array } from "@hgargg-0710/one"
import type {
	ICopiable,
	IDefaulting,
	IIndexable,
	IIndexingFunction,
	IRekeyable,
	IReversible,
	ISizeable
} from "../interfaces.js"

export interface IKeysHaving<KeyType = any> {
	readonly keys: KeyType[]
}

export interface IValuesHaving<ValueType = any> {
	readonly values: ValueType[]
}

export interface IIndexMap<
	KeyType = any,
	ValueType = any,
	DefaultType = any,
	IndexGetType = number
> extends IIndexable<ValueType | DefaultType>,
		Iterable<[KeyType, ValueType]>,
		ICopiable,
		ISizeable,
		IDefaulting<DefaultType>,
		IRekeyable<KeyType>,
		IReversible,
		IKeysHaving<KeyType>,
		IValuesHaving<ValueType> {
	unique: () => number[]
	byIndex: (index: number) => DefaultType | [KeyType, ValueType]
	swap: (i: number, j: number) => this

	getIndex: (key: any) => IndexGetType

	add: (index: number, ...pairs: array.Pairs<KeyType, ValueType>) => this
	delete: (index: number, count?: number) => this
	replace: (index: number, pair: [KeyType, ValueType]) => this
	set: (key: KeyType, value: ValueType, index?: number) => this
}

export interface IMapClass<KeyType = any, ValueType = any, DefaultType = any> {
	new (
		map?: array.Pairs<KeyType, ValueType>,
		_default?: DefaultType
	): IIndexMap<KeyType, ValueType, DefaultType>

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
