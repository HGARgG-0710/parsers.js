import type { IStep, IStepPredicate, IStream } from "../../../interfaces.js"

/**
 * This is `IPosition<IStream<T>>`, specific to library's stream objects.
 */
export type IStreamPosition<T = any> = IStep<IStream<T>>

export type IStreamPredicate<T = any> = IStepPredicate<IStream<T>>
