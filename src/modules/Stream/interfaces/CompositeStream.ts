import type { IArray, IInitializable } from "../../../interfaces.js"
import type {
	IControlStream,
	ILinkedStream,
	IOwnedStream
} from "./OwnedStream.js"

export type IStreamChoice = ILinkedStream | IRawStreamArray

export type IRawStream = ILinkedStream | IStreamChooser

export type IRawStreamArray = IRawStream[]

export type IRawStreamHandler = (x: IRawStream) => void

export interface IStreamChooser {
	(prevStream?: IOwnedStream): IStreamChoice

	// * note: this is an OPTIMIZATION-ONLY property
	// * 	(to permit fast checking whether or not a certain item is a `Switch`)
	// *		not actually included in the docs
	readonly isSwitch?: false
}

export type IStreamArray = IArray<IRawStream>

export type ICompositeStream<T = any> = IControlStream<T> &
	IInitializable<[IOwnedStream?]> & {
		renewResource: () => void
		readonly streams: IStreamArray
	}
