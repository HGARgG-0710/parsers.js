import type { IPattern, IPointer, IRecursivePointer } from "./interfaces.js"

import { type, object } from "@hgargg-0710/one"
const { isUndefined } = type
const { structCheck, prop } = object

/**
 * Returns whether the given value is an `IPointer`
 */
export const isPoiner = structCheck<IPointer>(["value"]) as <T = any>(
	x: any
) => x is IPointer<T>

/**
 * Returns the `.value` property of the given `Pattern`
 */
export const value = prop("value") as <Type = any>(x: IPattern<Type>) => Type | undefined

/**
 * Sets the `.value` property of a given `Pattern`
 */
export const setValue = <Type = any>(x: IPattern<Type>, value?: Type) => (x.value = value)

/**
 * Unless given `value` is `undefined`, calls `setValue(pattern, value)`
 */
export function optionalValue(pattern: IPattern, value?: any) {
	if (!isUndefined(value)) setValue(pattern, value)
}

/**
 * Swaps `.value`s of two given `Pattern`s
 */
export function swapValues<Type = any>(x: IPattern<Type>, y: IPattern<Type>) {
	const temp = x.value
	x.value = y.value
	y.value = temp
}

/**
 * Recursively walks down a given `depth` (`Infinity`, by default),
 * getting the `.value` of the next `RecursivePointer`.
 *
 * Returns the last obtainable non-`IPointer` value.
 *
 * Note: `isPointer` is used for checking whether the given object is an `IPointer`
 */
export function dig<Type = any>(
	pointer: IRecursivePointer<Type>,
	depth: number = Infinity
): Type | IRecursivePointer<Type> {
	let curr = pointer
	let currDepth = 0
	while (isPoiner(curr.value) && currDepth++ <= depth)
		curr = value(curr) as IRecursivePointer<Type>
	return curr
}
