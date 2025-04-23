import { functional, object, type } from "@hgargg-0710/one"
import type { IPointer } from "src/interfaces.js"
import { DelegateRekeyable } from "src/internal/delegates/Rekeyable.js"
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
import { makeDelegate } from "../refactor.js"
import { current } from "../Stream/utils.js"
import { isGoodPointer, pos } from "../utils.js"
import type { ILookupTable, ITableConstructor } from "./interfaces.js"

const { id } = functional
const { extendPrototype } = object
const { ConstDescriptor } = object.descriptor
const { isNullary } = type

abstract class DelegateLookupTable<
	KeyType = any,
	ValueType = any,
	OwningType = any,
	DelegateType extends ISettable<KeyType, ValueType> &
		IRekeyable<KeyType> &
		IDeletable<DeletedType> &
		ISizeable = any,
	DeletedType = KeyType,
	DefaultType = any
> extends DelegateRekeyable<
	KeyType,
	ValueType,
	DelegateType,
	DeletedType,
	DefaultType
> {
	abstract claim(x: any): OwningType | null

	isOwned<Type = any>(x: IIndexAssignable<Type>) {
		return !isNullary(x.assignedIndex)
	}
}

abstract class DelegateHashTable<
		KeyType = any,
		ValueType = any,
		DefaultType = any,
		OwningType = any
	>
	extends DelegateLookupTable<
		KeyType,
		ValueType,
		OwningType,
		IHashMap<KeyType, ValueType, DefaultType>,
		KeyType,
		DefaultType
	>
	implements ILookupTable<KeyType, ValueType, OwningType>
{
	["constructor"]: new (hash: IHashMap<KeyType, ValueType>) => ILookupTable<
		KeyType,
		ValueType,
		OwningType
	>

	byOwned(priorOwned: IIndexAssignable<OwningType>) {
		return this.value.index(priorOwned.assignedIndex)
	}

	copy(): ILookupTable<KeyType, ValueType, OwningType> {
		return new this.constructor(this.value)
	}

	constructor(hash: IHashMap<KeyType, ValueType>) {
		super(hash)
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
		IPointer<number>,
		IPersistentIndexMap<KeyType, ValueType, DefaultType>,
		any
	>
	implements ILookupTable<KeyType, ValueType, IPointer<number>>
{
	claim(x: any) {
		const pointer = this.value.getIndex(x)
		return isGoodPointer(pointer) ? pointer : null
	}

	byOwned(priorOwned: IIndexAssignable<IPointer<number>>): ValueType {
		return this.value.byIndex(priorOwned.assignedIndex!.value)[1]
	}

	delete(key: KeyType) {
		const { value } = this
		value.delete(value.getIndex(key).value)
		return this
	}

	copy() {
		return new PersistentIndexTable<KeyType, ValueType, DefaultType>(
			this.value.copy()
		)
	}
}

export const HashTable = new Autocache(
	new BasicHash(new MapInternal()),
	function <OwningType = any>(ownership: (x: any) => OwningType) {
		const hashTable = makeDelegate(DelegateHashTable, ["value"], "delegate")

		extendPrototype(hashTable, {
			claim: ConstDescriptor(function (x: any) {
				const pointer = ownership(x)
				return isNullary(pointer) ? null : pointer
			})
		})

		return hashTable
	}
) as unknown as <OwningType = any>(
	ownership: (x: any) => OwningType
) => ITableConstructor<OwningType>

export const BasicTable = HashTable(id)

export const StreamTable = HashTable(current)

export const PosTable = HashTable(pos)
