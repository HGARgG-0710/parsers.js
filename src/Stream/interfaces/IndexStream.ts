import type { ILineIndex } from "../interfaces.js"
import type { IOwnedStream } from "./OwnedStream.js"

export type IIndexStream<Type = any> = IOwnedStream<Type> & {
	lineIndex: ILineIndex
}
