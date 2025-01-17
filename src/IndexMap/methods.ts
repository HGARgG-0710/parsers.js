import { BaseIndexMap } from "./abstract.js"

export const {
	index,
	replace,
	add,
	delete: _delete,
	replaceKey,
	getIndex,
	unique
} = BaseIndexMap.prototype

export * as FastLookupTable from "./FastLookupTable/methods.js"
export * as HashMap from "./HashMap/methods.js"
export * as LinearIndexMap from "./LinearIndexMap/methods.js"
export * as PersistentIndexMap from "./PersistentIndexMap/methods.js"
