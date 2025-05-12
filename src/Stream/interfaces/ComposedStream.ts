import type { IArray } from "../../interfaces.js"
import type {
	IControlStream,
	ILinkedStream,
	IOwnedStream
} from "./OwnedStream.js"

export type IStreamChoice = ILinkedStream | IRawStreamArray

export type IRawStreamArray = (ILinkedStream | IStreamChooser)[]

export interface IStreamChooser {
	(prevStream?: IOwnedStream): IStreamChoice

	// * note: this is an OPTIMIZATION-ONLY property
	// * 	(to permit fast checking whether or not a certain item is a `Switch`)
	// *		not actually included in the docs
	readonly isSwitch?: false
}

export type IStreamArray = IArray<ILinkedStream | IStreamChooser>

export type IComposedStream<Type = any> = IControlStream<Type> & {
	readonly streams: IStreamArray
}
