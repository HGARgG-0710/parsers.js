import type { HashType } from "./interfaces.js"
import type { InternalHash } from "./InternalHash/interfaces.js"

import { DelegateSizeable } from "../abstract.js"

export abstract class BaseHashClass<
	KeyType = any,
	ValueType = any,
	InternalKeyType = any
> extends DelegateSizeable<InternalHash<InternalKeyType, ValueType>> {
	hash: HashType<KeyType, InternalKeyType>

	index(x: KeyType, ...y: any[]) {
		return this.value.get(this.hash(x, ...y))
	}

	set(key: KeyType, value: ValueType, ...y: any[]) {
		this.value.set(this.hash(key, ...y), value)
		return this
	}

	delete(key: KeyType, ...y: any[]) {
		this.value.delete(this.hash(key, ...y))
		return this
	}

	replaceKey(keyFrom: KeyType, keyTo: KeyType, ...y: any[]) {
		this.value.replaceKey(this.hash(keyFrom, ...y), this.hash(keyTo, ...y))
		return this
	}
}
