import { type } from "@hgargg-0710/one"
import type { IStream } from "../../../interfaces.js"
import type {
	IStreamPredicate,
	IStreamStep
} from "../interfaces/StreamPosition.js"

const { isFunction, isBoolean } = type

/**
 * Returns whether given `x` is an `IPredicatePosition<T>`
 */

export const isStreamPredicate = isFunction as <T = any>(
	x: any
) => x is IStreamPredicate<T>

export function asSteps<T = any, K extends IStream<T> = IStream<T>>(
	stream: K,
	stepPred: IStreamPredicate<T>
): number {
	if (stream.isEnd) return 0
	const result = stepPred(stream)
	return isBoolean(result) ? (result ? 1 : 0) : result
}

export function bindStep<T = any, K extends IStream<T> = IStream<T>>(
	x: IStreamStep<T>,
	stream: K
): IStreamStep<T> {
	return isStreamPredicate(x) ? x.bind(stream) : x
}
