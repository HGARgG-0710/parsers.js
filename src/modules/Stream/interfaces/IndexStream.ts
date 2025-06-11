import type { ILineIndex } from "../../../interfaces.js"
import type { ILinkedStream } from "./OwnedStream.js"

export type IIndexStream<T = any> = ILinkedStream<T> & {
	readonly lineIndex: ILineIndex
}
