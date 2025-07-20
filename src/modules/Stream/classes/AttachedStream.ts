import type {
	ILinkedStream,
	IOwnedStream,
	IOwningStream,
	IResourcefulStream
} from "../../../interfaces.js"
import { mixin } from "../../../mixin.js"
import { DelegateStream } from "./DelegateStream.js"
import { PipeStream } from "./PipeStream.js"
import { SyncStream } from "./SyncStream.js"

export abstract class AttachedStreamAnnotation<T = any, Args extends any[] = []>
	extends DelegateStream<T, Args>
	implements ILinkedStream<T>
{
	readonly isEnd: boolean
	readonly isStart: boolean
	readonly curr: T;

	*[Symbol.iterator]() {}

	setOwner(newOwner: IOwningStream): void {}

	constructor(resource?: IOwnedStream, ...args: [] | Partial<Args>) {
		super()
	}
}

const AttachedStreamMixin = new mixin<IResourcefulStream>(
	{
		name: "AttachedStream",
		properties: {}
	},
	[PipeStream, SyncStream]
)

function PreAttachedStream<T = any, Args extends any[] = any[]>() {
	return AttachedStreamMixin.toClass() as typeof AttachedStreamAnnotation<
		T,
		Args
	>
}

/**
 * This is an abstract class, implementing `ILinkedStream<T>`.
 * It is a mixin of `PipeStream` and `SyncStream`, which is
 * to say, it completely and utterly delegates itself onto its
 * `.resource: IOwnedStream`. The purpose of such a class is
 * to allow for easy creation of `ILinkedStream`-classes with
 * very little unique functionality of their own, and which are
 * (however) independent enough to need their own constructor
 * (and, therefore, the copying method).
 * 
 * It shares the constructor of `PipeStream`. 
 *
 * For an example of an even less autonomous derivative of 
 * `DelegateStream`, see `IdentityStream` [with a `.copy` 
 * method implemented]. 
 */
export const AttachedStream: ReturnType<typeof PreAttachedStream> & {
	generic?: typeof PreAttachedStream
} = PreAttachedStream()

AttachedStream.generic = PreAttachedStream
