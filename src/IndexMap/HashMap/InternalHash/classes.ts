import type { SubHaving } from "src/IndexMap/SubHaving/interfaces.js"
import type { InternalHash } from "./interfaces.js"
import {
	mapInternalHashGet,
	mapInternalHashReplaceKey,
	objectInternalHashDelete,
	objectInternalHashGet,
	objectInternalHashReplaceKey,
	objectInternalHashSet
} from "./methods.js"
import { subDelete, subSet, subSize } from "src/IndexMap/SubHaving/methods.js"

export class MapInternalHash<KeyType = any, ValueType = any>
	implements InternalHash<KeyType, ValueType>, SubHaving<Map<KeyType, ValueType>>
{
	sub: Map<KeyType, ValueType>
	size: number
	default: any

	get: (key: KeyType) => ValueType
	set: (key: KeyType, value: ValueType) => any
	delete: (key: KeyType) => any
	replaceKey: (keyFrom: KeyType, keyTo: KeyType) => any

	constructor(baseMap: Map<KeyType, ValueType>, _default: any) {
		this.sub = baseMap
		this.default = _default
	}
}

Object.defineProperties(MapInternalHash.prototype, {
	set: { value: subSet },
	get: { value: mapInternalHashGet },
	delete: { value: subDelete },
	size: { get: subSize },
	replaceKey: { value: mapInternalHashReplaceKey }
})

export class ObjectInternalHash<Type = any>
	implements InternalHash<string, Type>, SubHaving<object>
{
	sub: object
	default: any
	size: number

	get: (key: string) => Type
	set: (key: string, value: Type) => any
	delete: (key: string) => any
	replaceKey: (keyFrom: string, keyTo: string) => any

	constructor(baseObj: object, _default: any) {
		this.size = Object.keys(baseObj).length
		this.sub = baseObj
		this.default = _default
	}
}

Object.defineProperties(ObjectInternalHash.prototype, {
	get: { value: objectInternalHashGet },
	set: { value: objectInternalHashSet },
	delete: { value: objectInternalHashDelete },
	replaceKey: { value: objectInternalHashReplaceKey }
})
