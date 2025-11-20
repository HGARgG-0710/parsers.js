import type { IStream } from "../../../interfaces.js"

/**
 * This is `IPosition<IStream<T>>`, specific to library's stream objects.
 */
export type IStreamStep<T = any> = number | IStreamPredicate<T>

export type IStreamPredicate<T = any> = (
	item: IStream<T>,
	pos?: number
) => boolean | number
