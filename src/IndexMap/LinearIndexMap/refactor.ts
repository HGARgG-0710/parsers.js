import type { IIndexMap } from "../interfaces.js"
import { LinearMapClass } from "./classes.js"
import type { ILinearMapClass } from "./interfaces.js"

export namespace OptimizedLinearMap {
	export function optimize<KeyType = any, ValueType = any>(
		this: IIndexMap<KeyType, ValueType>,
		key: any
	) {
		return (this as any).alteredKeys.indexOf(key)
	}
}

export function extend<KeyType = any, ValueType = any>(
	this: ILinearMapClass<KeyType, ValueType>,
	...f: ((x: ValueType) => any)[]
) {
	return LinearMapClass<KeyType>(
		this.change,
		this.extensions.concat(f),
		this.keyExtensions
	)
}

export function extendKey<KeyType = any, ValueType = any>(
	this: ILinearMapClass<KeyType, ValueType>,
	...f: ((x: any) => KeyType)[]
) {
	return LinearMapClass<any, ValueType>(
		this.change,
		this.extensions,
		this.keyExtensions.concat(f)
	)
}
