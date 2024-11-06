import { inplace, array } from "@hgargg-0710/one"
import type { Pattern } from "./interfaces.js"
const { first } = array
const { mutate } = inplace

export function matchString(value: string, key: RegExp | string): string[] {
	return mutate([...value.matchAll(key as RegExp)], first)
}

export const value = <Type = any>(x: Pattern<Type>) => x.value
export const setValue = <Type = any>(x: Pattern<Type>, value: Type) => (x.value = value)

export * as Token from "./Token/utils.js"
export * as TokenizablePattern from "./TokenizablePattern/utils.js"
export * as ValidatablePattern from "./ValidatablePattern/utils.js"
