import type { InternalHash } from "./interfaces.js"
import type { Pairs } from "../../../IndexMap/interfaces.js"

import { valueDelete, valueSet, valueSize } from "../../../Pattern/methods.js"
import {
	mapInternalHashGet,
	mapInternalHashReplaceKey,
	objectInternalHashDelete,
	objectInternalHashGet,
	objectInternalHashReplaceKey,
	objectInternalHashSet
} from "./methods.js"

import { BasicPattern } from "../../../Pattern/classes.js"
import { extendClass } from "../../../utils.js"

import { typeof as type } from "@hgargg-0710/one"
const { isArray } = type

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

	constructor(
		map: Pairs<KeyType, ValueType> | Map<KeyType, ValueType> = new Map(),
		_default?: any
	) {
		super(isArray(map) ? new Map(map) : map)
		this.default = _default
	}
}

extendClass(MapInternalHash, {
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

extendClass(ObjectInternalHash, {
	get: { value: objectInternalHashGet },
	set: { value: objectInternalHashSet },
	delete: { value: objectInternalHashDelete },
	replaceKey: { value: objectInternalHashReplaceKey }
})
