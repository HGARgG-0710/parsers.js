import type {
	IExtendableCollection,
	IIndexed,
	IInitializable
} from "../../../interfaces.js"
import type { IOwnedStream } from "./OwnedStream.js"

export interface ISectionGrabber<T = any, C extends IIndexed<T> = IIndexed<T>>
	extends IInitializable<[IOwnedStream<T>]> {
	grab(into: IExtendableCollection<T, C>): void
	isLastSection(): boolean
	noMoreSections(): boolean
}
