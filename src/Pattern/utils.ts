import type { Pattern, Pointer, RecursivePointer } from "./interfaces.js"

import { type, object } from "@hgargg-0710/one"
const { isUndefined } = type
const { structCheck } = object

export const isPoiner = structCheck<Pointer>(["value"]) as <T = any>(
	x: any
) => x is Pointer<T>

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

export function dig<Type = any>(
	pointer: RecursivePointer<Type>,
	depth: number = Infinity
): Type | RecursivePointer<Type> {
	let curr = pointer
	let currDepth = 0
	while (isPoiner(curr.value) && currDepth++ <= depth)
		curr = value(curr) as RecursivePointer<Type>
	return curr
}
