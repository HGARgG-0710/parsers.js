import type { Pattern } from "./interfaces.js"

import { type } from "@hgargg-0710/one"
const { isUndefined } = type

export const value = <Type = any>(x: Pattern<Type>) => x.value
export const setValue = <Type = any>(x: Pattern<Type>, value?: Type) => (x.value = value)

export function optionalValue(pattern: Pattern, value?: any) {
	if (!isUndefined(value)) setValue(pattern, value)
}

export function swapValues<Type = any>(x: Pattern<Type>, y: Pattern<Type>) {
	const temp = x.value
	x.value = y.value
	y.value = temp
}
