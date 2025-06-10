import { mixin } from "../../../mixin.js"
import type {
	ILinkedStream,
	IOwnedStream,
	IOwningStream
} from "../interfaces/OwnedStream.js"
import { BasicStream } from "./BasicStream.js"
import { OwningStream } from "./OwningStream.js"
import { ResourceCopyingStream } from "./ResourceCopyingStream.js"
import { SyncCurrStream } from "./SyncCurrStream.js"

export abstract class BasicResourceStreamAnnotation<
		T = any,
		Args extends any[] = []
	>
	extends OwningStream<T, Args>
	implements IOwnedStream
{
	protected ["constructor"]: new (
		resource?: IOwnedStream,
		...args: Args | []
	) => this

	readonly owner?: IOwningStream

	protected abstract baseNextIter(curr?: T): T

	protected set isEnd(isEnd: boolean) {}
	protected set isStart(isEnd: boolean) {}
	protected set curr(curr: T) {}

	get isEnd() {
		return false
	}

	get isStart() {
		return true
	}

	get curr() {
		return null as any
	}

	copy(): this {
		return this
	}

	protected postEnd?(): void
	protected basePrevIter?(curr?: T): T
	protected postStart?(): void
	protected initGetter?(...args: Partial<Args>): T

	protected update(newCurr: T) {}
	protected preInit(...args: Partial<Args>) {}

	setOwner(newOwner?: unknown): void {}

	protected endStream(): void {}
	protected startStream(): void {}

	protected syncCurr(): void {}

	next(): void {}
	prev(): void {}

	*[Symbol.iterator]() {}
}

const BasicResourceStreamMixin = new mixin<ILinkedStream>(
	{
		name: "BasicResourceStream",
		properties: {},
		constructor: function (...items: any[]) {
			this.super.BasicStream.constructor.call(this, ...items)
		}
	},
	[ResourceCopyingStream, SyncCurrStream],
	[BasicStream, OwningStream]
)

function PreBasicResourceStream<T = any, Args extends any[] = any[]>() {
	return BasicResourceStreamMixin.toClass() as typeof BasicResourceStreamAnnotation<
		T,
		Args
	>
}

export const BasicResourceStream: ReturnType<typeof PreBasicResourceStream> & {
	generic?: typeof PreBasicResourceStream
} = PreBasicResourceStream()

BasicResourceStream.generic = PreBasicResourceStream
