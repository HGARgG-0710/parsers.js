import type { InternalHash } from "./interfaces.js"
import type { array } from "@hgargg-0710/one"

import { DelegateDeletableSettableSizeable } from "../../abstract.js"
import { ProtectedPattern } from "src/Pattern/abstract.js"

import { defaults } from "../../../constants.js"
const { InternalHash } = defaults
const { DefaultValue: objDefaultValue, MissingKey } = InternalHash.ObjectInternalHash
const { DefaultValue: mapDefaultValue } = InternalHash.MapInternalHash

import { type } from "@hgargg-0710/one"
const { isArray, isUndefined } = type

export class MapInternalHash<KeyType = any, ValueType = any, DefaultType = any>
	extends DelegateDeletableSettableSizeable<KeyType, ValueType, Map<KeyType, ValueType>>
	implements InternalHash<KeyType, ValueType, DefaultType>
{
	default: DefaultType

	get(x: KeyType) {
		const gotten = this.value.get(x)
		return isUndefined(gotten) ? this.default : gotten
	}

	rekey(fromKey: KeyType, toKey: KeyType) {
		const value = this.get(fromKey)
		this.delete(fromKey)
		this.set(toKey, value)
		return this
	}

	constructor(
		map:
			| array.Pairs<KeyType, ValueType>
			| Map<KeyType, ValueType> = mapDefaultValue(),
		_default?: DefaultType
	) {
		super(isArray(map) ? new Map(map) : map)
		this.default = _default!
	}
}

export class ObjectInternalHash<Type = any, DefaultType = any>
	extends ProtectedPattern<object>
	implements InternalHash<string, Type, DefaultType>
{
	default: DefaultType
	size: number

	get(key: string) {
		const read = this.value[key]
		return read === MissingKey ? this.default : read
	}

	set(key: string, value: Type) {
		if (this.value[key] === MissingKey) ++this.size
		this.value[key] = value
		return this
	}

	delete(key: string) {
		if (this.value[key] !== MissingKey) {
			--this.size
			this.value[key] = MissingKey
		}
		return this
	}

	rekey(keyFrom: string, keyTo: string) {
		this.value[keyTo] = this.value[keyFrom]
		this.value[keyFrom] = MissingKey
		return this
	}

	constructor(object: object = objDefaultValue(), _default?: DefaultType) {
		super(object)
		this.size = Object.keys(object).length
		this.default = _default!
	}
}
