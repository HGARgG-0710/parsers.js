import { type } from "@hgargg-0710/one"
import type { IStepPredicate, IStream } from "../interfaces.js"

const { isFunction, isBoolean } = type

/**
 * Returns whether given `x` is an `IPredicatePosition<T>`
 */
export const isStepPredicate = isFunction as <T = any>(
	x: any
) => x is IStepPredicate<T>

export function asSteps<T extends IStream = any>(
	stream: T,
	stepPred: IStepPredicate<T>
): number {
	if (stream.isEnd) return 0
	const result = stepPred(stream)
	return isBoolean(result) ? (result ? 1 : 0) : result
}
