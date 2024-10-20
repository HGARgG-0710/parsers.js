import type { MapClass, Pairs } from "../interfaces.js"
import { fromPairsList } from "../utils.js"

import { inplace } from "@hgargg-0710/one"
import { LinearMapClass } from "./classes.js"
import type { LinearIndexMap } from "./interfaces.js"
const { insert, out } = inplace

export function linearIndexMapIndex<KeyType = any, ValueType = any>(
	this: LinearIndexMap<KeyType, ValueType>,
	x: any
) {
	const valueIndex = this.getIndex(this.extension(x))
	return valueIndex > -1 ? this.values[valueIndex] : this.default
}

export function linearIndexMapReplace<KeyType = any, ValueType = any>(
	this: LinearIndexMap<KeyType, ValueType>,
	index: number,
	pair: [KeyType, ValueType]
): LinearIndexMap<KeyType, ValueType> {
	const [key, value] = pair
	this.keys[index] = key
	this.alteredKeys[index] = this.keyExtension(key)
	this.values[index] = value
	return this
}

export function linearIndexMapAdd<KeyType = any, ValueType = any>(
	this: LinearIndexMap<KeyType, ValueType>,
	index: number,
	...pairs: Pairs<KeyType, ValueType>
): LinearIndexMap<KeyType, ValueType> {
	const [keys, values] = fromPairsList(pairs)
	insert(this.keys, index, ...keys)
	insert(this.alteredKeys, index, ...keys.map((x) => this.keyExtension(x)))
	insert(this.values, index, ...values)
	return this
}

export function linearIndexMapDelete<KeyType = any, ValueType = any>(
	this: LinearIndexMap<KeyType, ValueType>,
	index: number,
	count: number = 1
): LinearIndexMap<KeyType, ValueType> {
	out(this.keys, index, count)
	out(this.alteredKeys, index, count)
	out(this.values, index, count)
	return this
}

export function linearIndexMapReplaceKey<KeyType = any, ValueType = any>(
	this: LinearIndexMap<KeyType, ValueType>,
	keyFrom: KeyType,
	keyTo: KeyType
) {
	const replacementIndex = this.keys.indexOf(keyFrom)
	this.keys[replacementIndex] = keyTo
	this.alteredKeys[replacementIndex] = this.keyExtension(keyTo)
	return this
}

export function optimizedLinearIndexMapGetIndex<KeyType = any, ValueType = any>(
	this: LinearIndexMap<KeyType, ValueType>,
	key: any
) {
	return this.alteredKeys.indexOf(key)
}

export function linearIndexMapGetIndex<KeyType = any, ValueType = any>(
	this: LinearIndexMap<KeyType, ValueType>,
	x: any
) {
	const size = this.size
	const sought = this.extension(x)
	for (let i = 0; i < size; ++i) if (this.change!(this.alteredKeys[i], sought)) return i
	return -1
}

export function mapClassExtend<KeyType = any, ValueType = any>(
	this: MapClass<KeyType, ValueType>,
	...f: ((x: ValueType) => any)[]
): MapClass<KeyType, any> {
	return LinearMapClass<KeyType>(
		this.extensions.concat(f),
		this.keyExtensions,
		this.change
	)
}

export function mapClassExtendKey<KeyType = any, ValueType = any>(
	this: MapClass<KeyType, ValueType>,
	...f: ((x: any) => KeyType)[]
): MapClass<any, ValueType> {
	return LinearMapClass<any, ValueType>(
		this.extensions,
		this.keyExtensions.concat(f),
		this.change
	)
}
