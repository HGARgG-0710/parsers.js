import type { Pairs } from "../../../IndexMap/interfaces.js"
import type { InternalHash } from "./interfaces.js"

import { DelegateDeletableSettableSizeable } from "../../abstract.js"
import { ProtectedPattern } from "src/Pattern/abstract.js"

import { defaults } from "../../../constants.js"
const { InternalHash } = defaults
const { DefaultValue: objDefaultValue } = InternalHash.ObjectInternalHash
const { DefaultValue: mapDefaultValue } = InternalHash.MapInternalHash

import { typeof as type } from "@hgargg-0710/one"
const { isArray, isUndefined } = type

export class MapInternalHash<KeyType = any, ValueType = any>
	extends DelegateDeletableSettableSizeable<KeyType, ValueType, Map<KeyType, ValueType>>
	implements InternalHash<KeyType, ValueType>
{
	default: any

	get(x: KeyType) {
		const gotten = this.value.get(x)
		return isUndefined(gotten) ? this.default : gotten
	}

	replaceKey(fromKey: KeyType, toKey: KeyType) {
		const value = this.get(fromKey)
		this.delete(fromKey)
		this.set(toKey, value)
		return this
	}

	constructor(
		map: Pairs<KeyType, ValueType> | Map<KeyType, ValueType> = mapDefaultValue(),
		_default?: any
	) {
		super(isArray(map) ? new Map(map) : map)
		this.default = _default
	}
}

export class ObjectInternalHash<Type = any>
	extends ProtectedPattern<object>
	implements InternalHash<string, Type>
{
	default: any
	size: number

	get(key: string) {
		const read = this.value[key]
		return isUndefined(read) ? this.default : read
	}

	set(key: string, value: Type) {
		if (isUndefined(this.value[key])) ++this.size
		this.value[key] = value
		return this
	}

	delete(key: string) {
		if (!isUndefined(this.value[key])) {
			--this.size
			this.value[key] = undefined
		}
		return this
	}

	replaceKey(keyFrom: string, keyTo: string) {
		this.value[keyTo] = this.value[keyFrom]
		this.value[keyFrom] = undefined
		return this
	}

	constructor(object: object = objDefaultValue(), _default?: any) {
		super(object)
		this.size = Object.keys(object).length
		this.default = _default
	}
}
