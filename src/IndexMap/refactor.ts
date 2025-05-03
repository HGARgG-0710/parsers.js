import type { IIndexMap, IMapClass, ISizeable } from "../interfaces.js"
import { isGoodIndex } from "../utils.js"
import { MapClass } from "./classes/MapClass.js"

export const inBound = (index: number, collection: ISizeable) =>
	isGoodIndex(index) && index < collection.size

export interface WeakSettable<KeyType = any, ValueType = any> {
	set: (key: KeyType, value: ValueType) => any
}

export interface WeakDeletable<KeyType = any> {
	delete: (key: KeyType) => any
}

export namespace OptimizedMap {
	export function optimize<KeyType = any, ValueType = any>(
		this: IIndexMap<KeyType, ValueType>,
		key: any
	) {
		return (this as any).alteredKeys.indexOf(key)
	}
}

export function extend<KeyType = any, ValueType = any>(
	this: IMapClass<KeyType, ValueType>,
	...f: ((x: ValueType) => any)[]
) {
	return MapClass<KeyType>(
		this.change,
		this.extensions.concat(f),
		this.keyExtensions
	)
}

export function extendKey<KeyType = any, ValueType = any>(
	this: IMapClass<KeyType, ValueType>,
	...f: ((x: any) => KeyType)[]
) {
	return MapClass<any, ValueType>(
		this.change,
		this.extensions,
		this.keyExtensions.concat(f)
	)
}
