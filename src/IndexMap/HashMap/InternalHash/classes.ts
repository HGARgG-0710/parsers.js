import type { InternalHash } from "./interfaces.js"
import {
	mapInternalHashDelete,
	mapInternalHashGet,
	mapInternalHashReplaceKey,
	mapInternalHashSet,
	mapInternalHashSize,
	objectInternalHashDelete,
	objectInternalHashGet,
	objectInternalHashReplaceKey,
	objectInternalHashSet
} from "./methods.js"

export class MapInternalHash<KeyType = any, ValueType = any>
	implements InternalHash<KeyType, ValueType>
{
	map: Map<KeyType, ValueType>
	size: number
	default: any

	get: (key: KeyType) => ValueType
	set: (key: KeyType, value: ValueType) => any
	delete: (key: KeyType) => any
	replaceKey: (keyFrom: KeyType, keyTo: KeyType) => any

	constructor(baseMap: Map<KeyType, ValueType>, _default: any) {
		this.map = baseMap
		this.default = _default
	}
}

Object.defineProperties(MapInternalHash.prototype, {
	set: { value: mapInternalHashSet },
	get: { value: mapInternalHashGet },
	delete: { value: mapInternalHashDelete },
	size: { get: mapInternalHashSize },
	replaceKey: { value: mapInternalHashReplaceKey }
})

export class ObjectInternalHash<Type = any> implements InternalHash<string, Type> {
	object: object
	default: any
	size: number

	get: (key: string) => Type
	set: (key: string, value: Type) => any
	delete: (key: string) => any
	replaceKey: (keyFrom: string, keyTo: string) => any

	constructor(baseObj: object, _default: any) {
		this.size = Object.keys(baseObj).length
		this.object = baseObj
		this.default = _default
	}
}

Object.defineProperties(ObjectInternalHash.prototype, {
	get: { value: objectInternalHashGet },
	set: { value: objectInternalHashSet },
	delete: { value: objectInternalHashDelete },
	replaceKey: { value: objectInternalHashReplaceKey }
})
