import { HashClass } from "./classes.js"
import type { HashClass as HashClassType, HashMap } from "./interfaces.js"

export function hashMapIndex<KeyType = any, ValueType = any, InternalKeyType = any>(
	this: HashMap<KeyType, ValueType, InternalKeyType>,
	x: KeyType
) {
	return this.sub.get(this.hash(x, this.sub))
}

export function hashMapSet<KeyType = any, ValueType = any, InternalKeyType = any>(
	this: HashMap<KeyType, ValueType, InternalKeyType>,
	key: KeyType,
	value: ValueType
) {
	this.keys.add(key)
	this.sub.set(this.hash(key, this.sub), value)
	return this
}

export function hashMapDelete<KeyType = any, ValueType = any, InternalKeyType = any>(
	this: HashMap<KeyType, ValueType, InternalKeyType>,
	key: KeyType
) {
	this.keys.delete(key)
	this.sub.delete(this.hash(key, this.sub))
}

export function hashMapReplaceKey<KeyType = any, ValueType = any, InternalKeyType = any>(
	this: HashMap<KeyType, ValueType, InternalKeyType>,
	keyFrom: KeyType,
	keyTo: KeyType
) {
	this.sub.replaceKey(this.hash(keyFrom, this.sub), this.hash(keyTo, this.sub))
	return this
}

export function hashClassExtend<KeyType = any, ValueType = any, InternalKeyType = any>(
	this: HashClassType<KeyType, ValueType, InternalKeyType>,
	f: (x: any) => KeyType
) {
	return HashClass<any, ValueType, InternalKeyType>((x: any) =>
		this.hash(f(x), this.sub)
	)
}

export * as InternalHash from "./InternalHash/methods.js"
