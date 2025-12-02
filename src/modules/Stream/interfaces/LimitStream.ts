import type { IPosed, IStreamPredicate } from "../../../interfaces.js"
import type { LimitStream } from "../objects/concrete/LimitStream.js"
import type { IOwnedStream } from "./OwnedStream.js"

/**
 * This is an `IOwnedStream<T>`, with `readonly pos: number` [tracking current
 * position].
 */
export type ILimitableStream<T = any> = IOwnedStream<T> & IPosed

export type ILongAsEndTestTypes = number | boolean

export type IUntilEndTestTypes = number | boolean

export type IStreamPredicateFormation<T = any> = (
	pred: IStreamPredicate<T>
) => IStreamPredicate<T>

export type IContextualStreamStep<T = any> =
	| number
	| LimitStream.StreamPredicateContext<T>
