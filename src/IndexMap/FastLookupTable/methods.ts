import { DelegateHashTable, DelegateLookupTable } from "./abstract.js"
import { PersistentIndexLookupTable as PersistentIndexLookupTableClass } from "./classes.js"

// * PersistentIndexLooupTable

export const { set, replaceKey, own } = DelegateLookupTable.prototype

export namespace PersistentIndexLookupTable {
	export const {
		delete: _delete,
		getIndex,
		byOwned
	} = PersistentIndexLookupTableClass.prototype
}

export namespace HashTable {
	export const { delete: _delete, byOwned } = DelegateHashTable.prototype
}
