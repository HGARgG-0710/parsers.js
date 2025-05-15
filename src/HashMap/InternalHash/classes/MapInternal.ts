import { array, type } from "@hgargg-0710/one"
import type { IInternalHash } from "../../interfaces/InternalHash.js"

const { isUndefined } = type

export class MapInternal<KeyType = any, ValueType = any, DefaultType = any>
	implements IInternalHash<KeyType, ValueType, DefaultType>
{
	private ["constructor"]: new (
		map?: array.Pairs<KeyType, ValueType> | Map<KeyType, ValueType>,
		_default?: DefaultType
	) => this

	private readonly map: Map<KeyType, ValueType>
	readonly default: DefaultType

	get(x: KeyType) {
		const gotten = this.map.get(x)
		return isUndefined(gotten) ? this.default : gotten
	}

	get size() {
		return this.map.size
	}

	set(key: KeyType, value: ValueType) {
		this.map.set(key, value)
		return this
	}

	delete(key: KeyType) {
		this.map.delete(key)
		return this
	}

	rekey(fromKey: KeyType, toKey: KeyType) {
		const value = this.get(fromKey)
		if (value !== this.default) {
			this.delete(fromKey)
			this.set(toKey, value as ValueType)
		}
		return this
	}

	copy() {
		return new this.constructor(this.map, this.default)
	}

	constructor(
		mapIterable: Iterable<[KeyType, ValueType]> = new Map(),
		_default?: DefaultType
	) {
		this.map = new Map(mapIterable)
		this.default = _default!
	}
}
