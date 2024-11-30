import type { Pairs } from "../interfaces.js"
import type { HashClass } from "./interfaces.js"
import type { InternalHashConstructor } from "./InternalHash/interfaces.js"

export function fromPairsList<KeyType = any, ValueType = any, InternalKeyType = any>(
	HashClass: HashClass<KeyType, ValueType>,
	InternalStructure: InternalHashConstructor<InternalKeyType, ValueType>,
	pairsList: Pairs<KeyType, ValueType>,
	_default?: any
) {
	const hashTable = new HashClass(new InternalStructure(undefined, _default))
	for (const [key, value] of pairsList) hashTable.set(key, value)
	return hashTable
}
