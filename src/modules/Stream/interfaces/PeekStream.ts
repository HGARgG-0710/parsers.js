import type { IPeekableStream } from "../../../interfaces.js"
import type { ILinkedStream } from "./OwnedStream.js"

export type IPeekStream<T = any> = ILinkedStream<T> &
	IPeekableStream<T>
