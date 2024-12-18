import type { HashType } from "./interfaces.js"
import type { InternalHash } from "./InternalHash/interfaces.js"

import { DelegateSizeable } from "../abstract.js"

export abstract class BaseHashClass<
	KeyType = any,
	ValueType = any,
	InternalKeyType = any
> extends DelegateSizeable<InternalHash<InternalKeyType, ValueType>> {
	hash: HashType<KeyType, ValueType, InternalKeyType>

	index(x: KeyType) {
		return this.value.get(this.hash(x, this.value))
	}

	set(key: KeyType, value: ValueType) {
		this.value.set(this.hash(key, this.value), value)
		return this
	}

	delete(key: KeyType) {
		this.value.delete(this.hash(key, this.value))
		return this
	}

	replaceKey(keyFrom: KeyType, keyTo: KeyType) {
		this.value.replaceKey(
			this.hash(keyFrom, this.value),
			this.hash(keyTo, this.value)
		)
		return this
	}
}
