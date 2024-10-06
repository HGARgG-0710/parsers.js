import { inplace, array } from "@hgargg-0710/one"
const { first } = array
const { mutate } = inplace

export function matchString(value: string, key: RegExp | string): string[] {
	return mutate([...value.matchAll(key as RegExp)], first)
}

export * as Token from "./Token/utils.js"
export * as TokenizablePattern from "./TokenizablePattern/utils.js"
