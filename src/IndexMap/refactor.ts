import type { ISizeable } from "../interfaces.js"
import { isGoodIndex } from "../utils.js"

export const inBound = (index: number, collection: ISizeable) =>
	isGoodIndex(index) && index < collection.size

export interface WeakSettable<KeyType = any, ValueType = any> {
	set: (key: KeyType, value: ValueType) => any
}

export interface WeakDeletable<KeyType = any> {
	delete: (key: KeyType) => any
}
