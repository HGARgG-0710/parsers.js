import type { MapClass } from "../interfaces.js"
import type { ILinearIndexMap } from "./interfaces.js"

import { LinearMapClass } from "./classes.js"

export namespace OptimizedLinearMap {
	export function optimize<KeyType = any, ValueType = any>(
		this: ILinearIndexMap<KeyType, ValueType>,
		key: any
	) {
		return (this as any).alteredKeys.indexOf(key)
	}
}

export function extend<KeyType = any, ValueType = any>(
	this: MapClass<KeyType, ValueType>,
	...f: ((x: ValueType) => any)[]
) {
	return LinearMapClass<KeyType>(
		this.extensions.concat(f),
		this.keyExtensions,
		this.change
	)
}

export function extendKey<KeyType = any, ValueType = any>(
	this: MapClass<KeyType, ValueType>,
	...f: ((x: any) => KeyType)[]
) {
	return LinearMapClass<any, ValueType>(
		this.extensions,
		this.keyExtensions.concat(f),
		this.change
	)
}
