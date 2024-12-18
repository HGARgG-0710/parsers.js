import type { MapClass } from "../interfaces.js"
import type { LinearIndexMap } from "./interfaces.js"

import { LinearMapClass } from "./classes.js"
import { BaseLinearMap } from "./abstract.js"

export namespace OptimizedLinearMap {
	export function optimize<KeyType = any, ValueType = any>(
		this: LinearIndexMap<KeyType, ValueType>,
		key: any
	) {
		return this.alteredKeys.indexOf(key)
	}
}

export const {
	index,
	replace,
	add,
	delete: _delete,
	replaceKey,
	getIndex
} = BaseLinearMap.prototype

export function extend<KeyType = any, ValueType = any>(
	this: MapClass<KeyType, ValueType>,
	...f: ((x: ValueType) => any)[]
): MapClass<KeyType, any> {
	return LinearMapClass<KeyType>(
		this.extensions.concat(f),
		this.keyExtensions,
		this.change
	)
}

export function extendKey<KeyType = any, ValueType = any>(
	this: MapClass<KeyType, ValueType>,
	...f: ((x: any) => KeyType)[]
): MapClass<any, ValueType> {
	return LinearMapClass<any, ValueType>(
		this.extensions,
		this.keyExtensions.concat(f),
		this.change
	)
}
