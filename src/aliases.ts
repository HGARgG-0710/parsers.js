import { object } from "@hgargg-0710/one"
import type { ISizeable } from "./interfaces.js"
const { prop } = object

/**
 * Returns the `.size` of the given `ISizeable` object
 */
export const size = prop("size") as (x: ISizeable) => number

export * as Node from "./aliases/Node.js"
export * as Stream from "./aliases/Stream.js"
