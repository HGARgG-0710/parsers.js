export type Constructor<Type = any> = Function & { prototype: Type }

export type * as IndexMap from "./IndexMap/interfaces.js"
export type * as Parser from "./Parser/interfaces.js"
export type * as Pattern from "./Pattern/interfaces.js"
export type * as Position from "./Position/interfaces.js"
export type * as Stream from "./Stream/interfaces.js"
export type * as Tree from "./Tree/interfaces.js"