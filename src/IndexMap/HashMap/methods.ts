import { HashClass } from "./classes.js"
import type { HashClass as HashClassType, HashMap } from "./interfaces.js"

export function hashMapIndex<KeyType = any, ValueType = any, InternalKeyType = any>(
	this: HashMap<KeyType, ValueType, InternalKeyType>,
	x: KeyType
) {
	return this.value.get(this.hash(x, this.value))
}

export function hashMapSet<KeyType = any, ValueType = any, InternalKeyType = any>(
	this: HashMap<KeyType, ValueType, InternalKeyType>,
	key: KeyType,
	value: ValueType
) {
	this.value.set(this.hash(key, this.value), value)
	return this
}

export function hashMapDelete<KeyType = any, ValueType = any, InternalKeyType = any>(
	this: HashMap<KeyType, ValueType, InternalKeyType>,
	key: KeyType
) {
	this.value.delete(this.hash(key, this.value))
	return this
}

export function hashMapReplaceKey<KeyType = any, ValueType = any, InternalKeyType = any>(
	this: HashMap<KeyType, ValueType, InternalKeyType>,
	keyFrom: KeyType,
	keyTo: KeyType
) {
	this.value.replaceKey(this.hash(keyFrom, this.value), this.hash(keyTo, this.value))
	return this
}

export function hashClassExtend<KeyType = any, ValueType = any, InternalKeyType = any>(
	this: HashClassType<KeyType, ValueType, InternalKeyType>,
	f: (x: any) => KeyType
) {
	return HashClass<any, ValueType, InternalKeyType>((x: any) =>
		this.hash(f(x), this.value)
	)
}

export * as InternalHash from "./InternalHash/methods.js"
