import { type } from "@hgargg-0710/one"
import type { IStepPredicate } from "../interfaces.js"

const { isFunction, isNumber, isBoolean } = type

/**
 * Returns whether given `x` is an `IPredicatePosition<T>`
 */
export const isStepPredicate = isFunction as <T = any>(
	x: any
) => x is IStepPredicate<T>

export function negate<T = any>(
	position: IStepPredicate<T>
): IStepPredicate<T> {
	return (x: T) => {
		const longAs = position(x)
		if (isNumber(longAs)) return longAs
		return !longAs
	}
}

export function asSteps<T = any>(
	stream: T,
	position: IStepPredicate<T>
): number {
	const result = position(stream)
	return isBoolean(result) ? (result ? 1 : 0) : result
}

/**
 * For a `pos: number`, this returns `pos`, and for a `IPredicatePosition`,
 * it returns `preserve(pos, (pos) => pos.bind(target))`.
 */
export function bind<T = any>(
	target: T,
	pos: IStepPredicate
): IStepPredicate<T> {
	return pos.bind(target)
}
