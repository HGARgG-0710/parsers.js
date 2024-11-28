import type { MapInternalHash, ObjectInternalHash } from "./classes.js"

import { typeof as type } from "@hgargg-0710/one"
const { isUndefined } = type

// * MapInternalHash

export function mapInternalHashGet<KeyType = any, ValueType = any>(
	this: MapInternalHash<KeyType, ValueType>,
	x: KeyType
) {
	const gotten = this.value.get(x)
	return isUndefined(gotten) ? this.default : gotten
}

export function mapInternalHashReplaceKey<KeyType = any, ValueType = any>(
	this: MapInternalHash<KeyType, ValueType>,
	fromKey: KeyType,
	toKey: KeyType
) {
	const value = this.get(fromKey)
	this.delete(fromKey)
	this.set(toKey, value)
	return this
}

// * ObjectInternalHash

export function objectInternalHashGet<Type = any>(
	this: ObjectInternalHash<Type>,
	key: string
) {
	const read = this.value[key]
	return isUndefined(read) ? this.default : read
}

export function objectInternalHashSet<Type = any>(
	this: ObjectInternalHash<Type>,
	key: string,
	value: Type
) {
	if (isUndefined(this.value[key])) ++this.size
	this.value[key] = value
	return this
}

export function objectInternalHashDelete<Type = any>(
	this: ObjectInternalHash<Type>,
	key: string
) {
	if (!isUndefined(this.value[key])) {
		--this.size
		this.value[key] = undefined
	}
	return this
}

export function objectInternalHashReplaceKey<Type = any>(
	this: ObjectInternalHash<Type>,
	keyFrom: string,
	keyTo: string
) {
	this.value[keyTo] = this.value[keyFrom]
	this.value[keyFrom] = undefined
	return this
}
