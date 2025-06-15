import { mixin } from "../../../mixin.js"
import type {
	ILinkedStream,
	IOwnedStream,
	IOwningStream
} from "../interfaces/OwnedStream.js"
import { DelegateStream } from "./DelegateStream.js"
import { DyssyncStream } from "./DyssyncStream.js"
import { PipeStream } from "./PipeStream.js"
import { ResourceCopyingStream } from "./ResourceCopyingStream.js"
import { SyncCurrStream } from "./SyncCurrStream.js"

abstract class DyssyncOwningStreamAnnotation<T = any, Args extends any[] = []>
	extends DelegateStream<T, Args>
	implements ILinkedStream<T>
{
	protected ["constructor"]: new (resource?: IOwnedStream<T>) => this

	protected set isEnd(isEnd: boolean) {}
	protected set isStart(isEnd: boolean) {}
	protected set curr(curr: T) {}

	protected endStream(): void {}
	protected startStream(): void {}

	readonly owner: IOwningStream

	setOwner: (newOwner?: unknown) => void

	get isEnd() {
		return false
	}

	get isStart() {
		return true
	}

	get curr() {
		return null as any
	}

	*[Symbol.iterator]() {}

	copy(): this {
		return this
	}

	protected syncCurr(): void {}
}

const DyssyncOwningStreamMixin = new mixin<ILinkedStream>(
	{
		name: "DyssyncOwningMixin",
		properties: {},
		constructor: function (resource?: IOwnedStream) {
			this.super.PipeStream.call(this, resource)
		}
	},
	[PipeStream, ResourceCopyingStream, SyncCurrStream],
	[DyssyncStream]
)

function PreDyssyncOwningStream<T = any, Args extends any[] = []>() {
	return DyssyncOwningStreamMixin.toClass() as typeof DyssyncOwningStreamAnnotation<
		T,
		Args
	>
}

/**
 * This is a class implementing `ILinkedStream<T>`.
 * It is a mixin of:
 *
 * 1. DyssyncStream
 * 2. PipeStream
 * 3. ResourceCopyingStream
 * 4. SyncCurrStream
 * 
 * It has the constructor of `PipeStream`
 */
export const DyssyncOwningStream: ReturnType<typeof PreDyssyncOwningStream> & {
	generic?: typeof PreDyssyncOwningStream
} = PreDyssyncOwningStream()

DyssyncOwningStream.generic = PreDyssyncOwningStream
