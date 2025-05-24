import type { ILineIndex } from "../../../interfaces/Stream.js"
import type { ILinkedStream } from "./OwnedStream.js"

export type IIndexStream<Type = any> = ILinkedStream<Type> & {
	readonly lineIndex: ILineIndex
}
