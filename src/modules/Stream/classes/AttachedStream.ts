import type {
	ILinkedStream,
	IOwnedStream,
	IOwningStream,
	IResourcefulStream
} from "../../../interfaces.js"
import { mixin } from "../../../mixin.js"
import { DelegateStreamAnnotation } from "./DelegateStream.js"
import { PipeStream } from "./PipeStream.js"
import { SyncStream } from "./SyncStream.js"

export abstract class AttachedStreamAnnotation<T = any, Args extends any[] = []>
	extends DelegateStreamAnnotation<T, Args>
	implements ILinkedStream<T>
{
	readonly isEnd: boolean
	readonly isStart: boolean
	readonly curr: T;

	*[Symbol.iterator]() {}

	setOwner(newOwner: IOwningStream): void {}

	constructor(resource?: IOwnedStream) {
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

export const AttachedStream: ReturnType<typeof PreAttachedStream> & {
	generic?: typeof PreAttachedStream
} = PreAttachedStream()

AttachedStream.generic = PreAttachedStream
