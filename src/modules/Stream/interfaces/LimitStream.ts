import type { IPosed } from "../../../interfaces.js"
import type { IIsCurrStartable } from "../../../interfaces/Stream.js"
import type { IOwnedStream } from "./OwnedStream.js"

/**
 * This is an `IOwnedStream<T>`, with `readonly pos: number` [tracking current
 * position], and an `isCurrStart(): boolean` method.
 */
export type ILimitableStream<T = any> = IOwnedStream<T> &
	IIsCurrStartable &
	IPosed<number>
