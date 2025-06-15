import { type as _type, boolean, object } from "@hgargg-0710/one"
import type { IChildrenHaving, IValued } from "../interfaces.js"
import type { ITyped } from "../interfaces/Node.js"

const { structCheck } = object
const { T } = boolean
const { isArray } = _type

/**
 * Verifies that given input is a non-`null` object with a `.type` property on it.
 */
export const isTyped = structCheck<ITyped>(["type"])

/**
 * Verifies that given input is a non-`null` object with `.type` and `.value` properties on it.
 */
export const isContentNodeSerializable = structCheck<ITyped & IValued>([
	"type",
	"value"
])

/**
 * Verifies that given input is a non-`null` object with `.type` and `.children` property, 
 * the latter of which is an array. 
*/
export const isRecursiveNodeSerializable = structCheck<
	ITyped & IChildrenHaving
>({
	type: T,
	children: isArray
})
