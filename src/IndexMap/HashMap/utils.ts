import type { IHashClass } from "./interfaces.js"
import type { InternalHash } from "./InternalHash/interfaces.js"

import type { array } from "@hgargg-0710/one"

/**
 * Creates and returns a new instance of the given `HashClass` using the underlying `InternalStructure` 
 * representation, with `pairsList` used as the values passed to the `HashClass.prototype.set` method, 
 * and with `_default` (optional) used as the default value for the `HashClass`
*/
export function fromPairs<
	KeyType = any,
	ValueType = any,
	InternalKeyType = any,
	DefaultType = any,
	InputType = any
>(
	HashClass: IHashClass<KeyType, ValueType, InternalKeyType, DefaultType>,
	InternalStructure: new (input?: InputType, _default?: DefaultType) => InternalHash<
		InternalKeyType,
		ValueType,
		DefaultType
	>,
	pairsList: array.Pairs<KeyType, ValueType>,
	_default?: DefaultType
) {
	const hashTable = new HashClass(new InternalStructure(undefined, _default))
	for (const [key, value] of pairsList) hashTable.set(key, value)
	return hashTable
}
