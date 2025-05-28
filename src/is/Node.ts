import { type as _type, boolean, object } from "@hgargg-0710/one"
import type { IChildrenHaving, IValued } from "../interfaces.js"
import type { ITyped } from "../interfaces/Node.js"

const { structCheck } = object
const { T } = boolean
const { isArray } = _type

export const isTyped = structCheck<ITyped>(["type"])
export const isContentNodeSerializable = structCheck<ITyped & IValued>([
	"type",
	"value"
])

export const isRecursiveNodeSerializable = structCheck<
	ITyped & IChildrenHaving
>({
	type: T,
	children: isArray
})
