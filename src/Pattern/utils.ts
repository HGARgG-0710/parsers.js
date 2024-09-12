import { inplace, array, object, typeof as type } from "@hgargg-0710/one"
const { first } = array
const { mutate } = inplace
const { structCheck } = object
const { isFunction } = type

import type { Flushable, Resulting } from "./interfaces.js"

export function matchString(value: string, key: RegExp | string): string[] {
	return mutate([...value.matchAll(key as RegExp)], first)
}

export const isResulting = structCheck<Resulting>(["result"])
export const isFlushable = structCheck<Flushable>({ flush: isFunction })

export * as TokenizablePattern from "./TokenizablePattern/utils.js"
export * as Token from "./Token/utils.js"
