import type { HashClass } from "./interfaces.js"
import type { InternalHashConstructor } from "./InternalHash/interfaces.js"

import type { array } from "@hgargg-0710/one"

export function fromPairsList<KeyType = any, ValueType = any, InternalKeyType = any>(
	HashClass: HashClass<KeyType, ValueType>,
	InternalStructure: InternalHashConstructor<InternalKeyType, ValueType>,
	pairsList: array.Pairs<KeyType, ValueType>,
	_default?: any
) {
	const hashTable = new HashClass(new InternalStructure(undefined, _default))
	for (const [key, value] of pairsList) hashTable.set(key, value)
	return hashTable
}
