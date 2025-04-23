import type { IPointer } from "./interfaces.js"

// * Explanation: objects are passed by reference, ergo, it's possible to keep the
// * 	index of a 'PersistentIndexMap' consistent across multiple sources,
// * 	via wrapping it into a one-property object;

export const Pointer = <Type = any>(value: Type): IPointer<Type> => ({ value })

export * from "./classes/PropDigger.js"
export * as Collection from "./Collection/classes.js"
export * as Parser from "./DynamicParser/classes.js"
export * as EnumSpace from "./EnumSpace/classes.js"
export * as HashMap from "./HashMap/classes.js"
export * as IndexMap from "./IndexMap/classes.js"
export * as LookupTable from "./LookupTable/classes.js"
export * as Node from "./Node/classes.js"
export * as Stream from "./Stream/classes.js"
export * as TableMap from "./TableMap/classes.js"
