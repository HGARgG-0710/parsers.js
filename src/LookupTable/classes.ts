import { functional, type } from "@hgargg-0710/one"
import type { IndexPointer } from "../classes.js"
import { BasicHash } from "../HashMap/classes.js"
import type { IHashMap } from "../HashMap/interfaces.js"
import { MapInternal } from "../HashMap/InternalHash/classes.js"
import type { IPersistentIndexMap } from "../IndexMap/PersistentIndexMap/interfaces.js"
import type {
	IDeletable,
	IIndexAssignable,
	IRekeyable,
	ISettable,
	ISizeable
} from "../interfaces.js"
import { Autocache } from "../internal/Autocache.js"
import { current } from "../Stream/utils.js"
import { pos } from "../utils.js"
import type { ILookupTable, ITableConstructor } from "./interfaces.js"

const { id } = functional
const { isNullary } = type

abstract class DelegateLookupTable<
	KeyType = any,
	ValueType = any,
	OwningType = any,
	DelegateType extends ISettable<KeyType, ValueType> &
		IRekeyable<KeyType> &
		IDeletable<DeletedType> &
		ISizeable = any,
	DeletedType = KeyType
> {
	abstract claim(x: any): OwningType | null

	protected delegate: DelegateType

	get size() {
		return this.delegate.size
	}

	set(key: KeyType, value: ValueType) {
		this.delegate.set(key, value)
		return this
	}

	delete(key: DeletedType) {
		this.delegate.delete(key)
		return this
	}

	rekey(keyFrom: KeyType, keyTo: KeyType) {
		this.delegate.rekey(keyFrom, keyTo)
		return this
	}

	isOwned<Type = any>(x: IIndexAssignable<Type>) {
		return !isNullary(x.assignedIndex)
	}

	constructor(value: DelegateType) {
		this.delegate = value
	}
}

export class PersistentIndexTable<
		KeyType = any,
		ValueType = any,
		DefaultType = any
	>
	extends DelegateLookupTable<
		KeyType,
		ValueType,
		IndexPointer,
		IPersistentIndexMap<KeyType, ValueType, DefaultType>,
		any
	>
	implements ILookupTable<KeyType, ValueType, IndexPointer>
{
	["constructor"]: new (
		delegate: IPersistentIndexMap<KeyType, ValueType, DefaultType>
	) => this

	claim(x: any) {
		const pointer = this.delegate.getIndex(x)
		return pointer.isGood() ? pointer : null
	}

	byOwned(priorOwned: IIndexAssignable<IndexPointer>): ValueType {
		return this.delegate.byIndex(priorOwned.assignedIndex!.index)[1]
	}

	delete(key: KeyType) {
		const { delegate } = this
		delegate.delete(delegate.getIndex(key).index)
		return this
	}

	copy() {
		return new this.constructor(this.delegate.copy())
	}
}

export const HashTable = new Autocache(
	new BasicHash(new MapInternal()),
	function <OwningType = any>(
		ownership: (x: any) => OwningType
	): ITableConstructor<OwningType> {
		return class<KeyType = any, ValueType = any, DefaultType = any>
			extends DelegateLookupTable<
				KeyType,
				ValueType,
				OwningType,
				IHashMap<KeyType, ValueType, DefaultType>,
				KeyType
			>
			implements ILookupTable<KeyType, ValueType, OwningType>
		{
			["constructor"]: new (hash: IHashMap<KeyType, ValueType>) => this

			byOwned(priorOwned: IIndexAssignable<OwningType>) {
				return this.delegate.index(priorOwned.assignedIndex)
			}

			claim(x: any) {
				const pointer = ownership(x)
				return isNullary(pointer) ? null : pointer
			}

			copy() {
				return new this.constructor(this.delegate)
			}

			constructor(hash: IHashMap<KeyType, ValueType>) {
				super(hash)
			}
		}
	}
)

export const BasicTable = HashTable(id)

export const StreamTable = HashTable(current)

export const PosTable = HashTable(pos)
