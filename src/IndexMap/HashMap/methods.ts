import { HashClass } from "./classes.js"
import type { HashClass as HashClassType, HashMap } from "./interfaces.js"

export function hashMapIndex<KeyType = any, ValueType = any, InternalKeyType = any>(
	this: HashMap<KeyType, ValueType, InternalKeyType>,
	x: KeyType
) {
	return this.structure.get(this.hash(x, this.structure))
}

export function hashMapSize<KeyType = any, ValueType = any, InternalKeyType = any>(
	this: HashMap<KeyType, ValueType, InternalKeyType>
) {
	return this.structure.size
}

export function hashMapSet<KeyType = any, ValueType = any, InternalKeyType = any>(
	this: HashMap<KeyType, ValueType, InternalKeyType>,
	key: KeyType,
	value: ValueType
) {
	this.keys.add(key)
	this.structure.set(this.hash(key, this.signature), value)
	return this
}

export function hashMapDelete<KeyType = any, ValueType = any, InternalKeyType = any>(
	this: HashMap<KeyType, ValueType, InternalKeyType>,
	key: KeyType
) {
	this.keys.delete(key)
	this.structure.delete(this.hash(key, this.structure))
}

export function hashClassExtend<KeyType = any, ValueType = any, InternalKeyType = any>(
	this: HashClassType<KeyType, ValueType, InternalKeyType>,
	f: (x: any) => KeyType
) {
	return HashClass<any, ValueType, InternalKeyType>((x: any) =>
		this.hash(f(x), this.structure)
	)
}

export * as InternalHash from "./InternalHash/methods.js"
