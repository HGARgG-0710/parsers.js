import type { MapInternalHash, ObjectInternalHash } from "./classes.js"

export function mapInternalHashGet<KeyType = any, ValueType = any>(
	this: MapInternalHash<KeyType, ValueType>,
	x: KeyType
) {
	const gotten = this.map.get(x)
	return gotten === undefined ? this.default : gotten
}

export function mapInternalHashSet<KeyType = any, ValueType = any>(
	this: MapInternalHash<KeyType, ValueType>,
	key: KeyType,
	value: ValueType
) {
	this.map.set(key, value)
	return this
}

export function mapInternalHashDelete<KeyType = any, ValueType = any>(
	this: MapInternalHash<KeyType, ValueType>,
	key: KeyType
) {
	this.map.delete(key)
	return this
}

export function mapInternalHashSize<KeyType = any, ValueType = any>(
	this: MapInternalHash<KeyType, ValueType>
) {
	return this.map.size
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

export function objectInternalHashGet<Type = any>(
	this: ObjectInternalHash<Type>,
	key: string
) {
	const read = this.object[key]
	return read === undefined ? this.default : read
}

export function objectInternalHashSet<Type = any>(
	this: ObjectInternalHash<Type>,
	key: string,
	value: Type
) {
	if (this.object[key] === undefined) ++this.size
	this.object[key] = value
	return this
}

export function objectInternalHashDelete<Type = any>(
	this: ObjectInternalHash<Type>,
	key: string
) {
	if (this.object[key] !== undefined) {
		--this.size
		this.object[key] = undefined
	}
	return this
}

export function objectInternalHashReplaceKey<Type = any>(
	this: ObjectInternalHash<Type>,
	keyFrom: string,
	keyTo: string
) {
	this.object[keyTo] = this.object[keyFrom]
	this.object[keyFrom] = undefined
	return this
}
