import { array, typeof as type } from "@hgargg-0710/one"
const { propPreserve } = array
const { isArray } = type

import type { Pattern } from "./interfaces.js"
import { isPattern } from "./utils.js"

export const ArrayPattern: (x: Pattern<any[]>) => any[] = propPreserve(
	(pattern: Pattern<any[]>) => [...pattern.value]
)

export function RecursiveArrayPattern(recursivePattern: any) {
	if (!(isPattern(recursivePattern) && isArray(recursivePattern.value)))
		return recursivePattern
	recursivePattern.value = recursivePattern.value.map(RecursiveArrayPattern)
	return ArrayPattern(recursivePattern)
}

export * as Collection from "./Collection/classes.js"
export * as EliminablePattern from "./EliminablePattern/classes.js"
export * as EnumSpace from "./EnumSpace/classes.js"
export * as Token from "./Token/classes.js"
export * as TokenizablePattern from "./TokenizablePattern/classes.js"
export * as ValidatablePattern from "./ValidatablePattern/classes.js"
