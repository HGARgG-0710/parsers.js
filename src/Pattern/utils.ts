import { inplace, array, object, typeof as type } from "@hgargg-0710/one"
const { first } = array
const { mutate } = inplace
const { structCheck } = object
const { isFunction } = type

import type { Pattern, Flushable, Resulting } from "./interfaces.js"

export function matchString(value: string, key: RegExp | string): string[] {
	return mutate([...value.matchAll(key as RegExp)], first)
}

export const isResulting = structCheck<Resulting>(["result"])
export const isFlushable = structCheck<Flushable>({ flush: isFunction })
export const isPattern = structCheck<Pattern>(["value"])

export * as Collection from "./Collection/utils.js"
export * as EliminablePattern from "./EliminablePattern/utils.js"
export * as EnumSpace from "./EnumSpace/utils.js"
export * as Token from "./Token/utils.js"
export * as TokenizablePattern from "./TokenizablePattern/utils.js"
export * as ValidatablePattern from "./ValidatablePattern/utils.js"
