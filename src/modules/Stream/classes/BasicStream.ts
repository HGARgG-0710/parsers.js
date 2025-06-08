import { Initializable } from "../../../classes/Initializer.js"
import type { IInitializer } from "../../../interfaces.js"
import type { IOwnedStream, IOwningStream } from "../../../interfaces/Stream.js"
import { mixin } from "../../../mixin.js"
import { DyssyncStream, DyssyncStreamAnnotation } from "./DyssyncStream.js"
import { IterableStream } from "./IterableStream.js"
import { OwnableStream } from "./OwnableStream.js"

export abstract class BasicStreamAnnotation<T = any, Args extends any[] = any[]>
	extends DyssyncStreamAnnotation<T, Args>
	implements IOwnedStream<T>
{
	protected abstract initializer: IInitializer<Args>
	protected abstract baseNextIter(curr?: T): T

	readonly owner?: IOwningStream

	protected postEnd?(): void
	protected basePrevIter?(curr?: T): T
	protected postStart?(): void
	protected initGetter?(...args: Partial<Args>): T

	isCurrStart?(): boolean

	protected update(newCurr: T) {}
	protected preInit(...args: Partial<Args>) {}

	next(): void {}
	prev(): void {}

	setOwner(newOwner?: unknown): void {}

	*[Symbol.iterator]() {
		yield null as T
	}
}

const BasicStreamMixin = new mixin<IOwnedStream>(
	{
		name: "BasicStream",
		properties: {
			update(newCurr: any) {
				this.curr = newCurr
			},

			preInit(...args: any[]) {
				if (this.initGetter) this.curr = this.initGetter(...args)
			},

			endStream() {
				this.isEnd = true
				this.isStart = false
			},

			startStream() {
				this.isStart = true
				this.isEnd = false
			},

			next() {
				const curr = this.curr
				this.isStart = false
				if (this.isCurrEnd()) {
					this.endStream()
					this.postEnd?.()
				} else this.update(this.baseNextIter(curr))
			},

			prev() {
				const curr = this.curr
				this.isEnd = false
				if (this.isCurrStart!()) {
					this.startStream()
					this.postStart?.()
				} else this.update(this.basePrevIter!(curr))
			},

			init(...args: any[]) {
				this.startStream()
				this.super.Initializable.init.call(this, ...args)
				this.preInit(...args)
				return this
			}
		},
		constructor: function (...args: any[]) {
			this.super.Initializable.constructor.call(this, ...args)
		}
	},
	[],
	[Initializable, DyssyncStream, OwnableStream, IterableStream]
)

function PreBasicStream<T = any, Args extends any[] = any[]>() {
	return BasicStreamMixin.toClass() as typeof BasicStreamAnnotation<T, Args>
}

export const BasicStream: ReturnType<typeof PreBasicStream> & {
	generic?: typeof PreBasicStream
} = PreBasicStream()

BasicStream.generic = PreBasicStream
