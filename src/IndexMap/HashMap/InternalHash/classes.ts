import type { InternalHash } from "./interfaces.js"
import { valueDelete, valueSet, valueSize } from "src/Pattern/methods.js"
import {
	mapInternalHashGet,
	mapInternalHashReplaceKey,
	objectInternalHashDelete,
	objectInternalHashGet,
	objectInternalHashReplaceKey,
	objectInternalHashSet
} from "./methods.js"

import { BasicPattern } from "src/Pattern/classes.js"

export class MapInternalHash<KeyType = any, ValueType = any>
	extends BasicPattern<Map<KeyType, ValueType>>
	implements InternalHash<KeyType, ValueType>
{
	size: number
	default: any

	get: (key: KeyType) => ValueType
	set: (key: KeyType, value: ValueType) => any
	delete: (key: KeyType) => any
	replaceKey: (keyFrom: KeyType, keyTo: KeyType) => any

	constructor(map: Map<KeyType, ValueType> = new Map(), _default?: any) {
		super(map)
		this.default = _default
	}
}

Object.defineProperties(MapInternalHash.prototype, {
	set: { value: valueSet },
	get: { value: mapInternalHashGet },
	delete: { value: valueDelete },
	size: { get: valueSize },
	replaceKey: { value: mapInternalHashReplaceKey }
})

export class ObjectInternalHash<Type = any>
	extends BasicPattern<object>
	implements InternalHash<string, Type>
{
	default: any
	size: number

	get: (key: string) => Type
	set: (key: string, value: Type) => any
	delete: (key: string) => any
	replaceKey: (keyFrom: string, keyTo: string) => any

	constructor(object: object = {}, _default?: any) {
		super(object)
		this.size = Object.keys(object).length
		this.default = _default
	}
}

Object.defineProperties(ObjectInternalHash.prototype, {
	get: { value: objectInternalHashGet },
	set: { value: objectInternalHashSet },
	delete: { value: objectInternalHashDelete },
	replaceKey: { value: objectInternalHashReplaceKey }
})
