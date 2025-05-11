import type { StreamList } from "../../internal/StreamList.js"
import type { ILinkedStream, IOwnedStream } from "./OwnedStream.js"

export type IStreamChoice = ILinkedStream | IStreamArray

export type IStreamArray = (ILinkedStream | IStreamChooser)[]

export interface IStreamChooser {
	(prevStream?: IOwnedStream): IStreamChoice

	// * note: this is an OPTIMIZATION-ONLY property
	// * 	(to permit fast checking whether or not a certain item is a `Switch`)
	// *		not actually included in the docs
	readonly isSwitch?: false
}

export type IComposedStream<Type = any> = IOwnedStream<Type> & {
	readonly streams: StreamList
}
