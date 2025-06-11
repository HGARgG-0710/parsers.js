import { object, type } from "@hgargg-0710/one"
import type { ICopiable } from "./interfaces.js"

const { isFunction } = type
const { structCheck } = object

/**
 * Returns whether the given item is `ICopiable`. 
*/
export const isCopiable = structCheck<ICopiable>({ copy: isFunction })

export * as Node from "./is/Node.js"
export * as Stream from "./is/Stream.js"
