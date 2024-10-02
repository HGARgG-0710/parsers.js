import type { MapInternalHash, ObjectInternalHash } from "./classes.js"

// * MapInternalHash

export function mapInternalHashGet<KeyType = any, ValueType = any>(
	this: MapInternalHash<KeyType, ValueType>,
	x: KeyType
) {
	const gotten = this.sub.get(x)
	return gotten === undefined ? this.default : gotten
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
	const read = this.sub[key]
	return read === undefined ? this.default : read
}

export function objectInternalHashSet<Type = any>(
	this: ObjectInternalHash<Type>,
	key: string,
	value: Type
) {
	if (this.sub[key] === undefined) ++this.size
	this.sub[key] = value
	return this
}

export function objectInternalHashDelete<Type = any>(
	this: ObjectInternalHash<Type>,
	key: string
) {
	if (this.sub[key] !== undefined) {
		--this.size
		this.sub[key] = undefined
	}
	return this
}

export function objectInternalHashReplaceKey<Type = any>(
	this: ObjectInternalHash<Type>,
	keyFrom: string,
	keyTo: string
) {
	this.sub[keyTo] = this.sub[keyFrom]
	this.sub[keyFrom] = undefined
	return this
}
