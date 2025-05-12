import type { IPeekableStream } from "../../interfaces.js"
import type { ILinkedStream } from "./OwnedStream.js"

export type IPeekStream<Type = any> = ILinkedStream<Type> &
	IPeekableStream<Type>
