import type { IHashClass } from "./interfaces.js"
import type { InternalHashConstructor } from "./InternalHash/interfaces.js"

import type { array } from "@hgargg-0710/one"

export function fromPairs<
	KeyType = any,
	ValueType = any,
	InternalKeyType = any,
	DefaultType = any,
	InputType = any
>(
	HashClass: IHashClass<KeyType, ValueType, InternalKeyType>,
	InternalStructure: InternalHashConstructor<
		InternalKeyType,
		ValueType,
		InputType,
		DefaultType
	>,
	pairsList: array.Pairs<KeyType, ValueType>,
	_default?: DefaultType
) {
	const hashTable = new HashClass(new InternalStructure(undefined, _default))
	for (const [key, value] of pairsList) hashTable.set(key, value)
	return hashTable
}
