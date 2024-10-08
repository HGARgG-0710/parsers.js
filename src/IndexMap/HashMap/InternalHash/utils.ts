import type { Pairs } from "src/IndexMap/interfaces.js"
import type { HashClass } from "../interfaces.js"
import type { InternalHashClass } from "./interfaces.js"

export function hashFromPairsList<KeyType = any, ValueType = any, InternalKeyType = any>(
	HashClass: HashClass<KeyType, ValueType>,
	InternalStructure: InternalHashClass<InternalKeyType, ValueType>,
	pairsList: Pairs<KeyType, ValueType>,
	_default?: any
) {
	const hashTable = new HashClass(new InternalStructure(undefined, _default))
	for (const [key, value] of pairsList) hashTable.set(key, value)
	return hashTable
}
