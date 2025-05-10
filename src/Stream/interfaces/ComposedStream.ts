import type { StreamList } from "../../internal/StreamList.js"
import type { IOwnedStream } from "./OwnedStream.js"

export type IStreamArray<Type = any> = (
	| IOwnedStream<Type>
	| IStreamChooser<Type>
)[]

export interface IStreamChooser<Type = any> {
	(prevStream?: IOwnedStream<Type>): IOwnedStream<Type> | IStreamArray<Type>

	// * note: this is an OPTIMIZATION-ONLY property
	// * 	(to permit fast checking whether or not a certain item is a `Switch`)
	// *		not actually included in the docs
	readonly isSwitch?: false
}

export type IComposedStream<Type = any> = IOwnedStream<Type> & {
	readonly streams: StreamList
}
