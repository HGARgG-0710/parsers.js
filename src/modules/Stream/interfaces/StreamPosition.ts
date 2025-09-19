import type { IPosition, IStream } from "../../../interfaces.js"

/**
 * This is `IPosition<IStream<T>>`, specific to library's stream objects.
 */
export type IStreamPosition<T = any> = IPosition<IStream<T>>
