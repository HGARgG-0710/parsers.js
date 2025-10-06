import type { IPosed } from "../../../interfaces.js"
import type { IOwnedStream } from "./OwnedStream.js"

/**
 * This is an `IOwnedStream<T>`, with `readonly pos: number` [tracking current
 * position].
 */
export type ILimitableStream<T = any> = IOwnedStream<T> & IPosed
