import { boolean, number, type } from "@hgargg-0710/one"
import type { IBufferized, IFinishable } from "../../../interfaces.js"
import type {
	ILinkedStream,
	INavigable,
	IOwnedStream,
	IPosition,
	IPredicatePosition,
	IRewindable
} from "../../../interfaces/Stream.js"
import { OutputBuffer } from "../../../internal/OutputBuffer.js"
import { mixin } from "../../../mixin.js"
import { uniNavigate } from "../../../utils/Stream.js"
import { direction } from "../utils/Position.js"
import { DyssyncStream } from "./DyssyncStream.js"
import { PipeStream } from "./PipeStream.js"
import { PosHavingStream } from "./PosHavingStream.js"
import { PosStreamAnnotation } from "./PosStream.js"
import { ResourceCopyingStream } from "./ResourceCopyingStream.js"

const { max } = number
const { isNumber } = type
const { T } = boolean

class FreezableStreamAnnotation<T = any>
	extends PosStreamAnnotation<T>
	implements IBufferized<T>, INavigable<T>, IFinishable, IRewindable
{
	readonly buffer: OutputBuffer

	navigate(relativePos: IPosition<T>): T {
		return null as T
	}

	finish(): T {
		return null as T
	}

	rewind() {
		return null as T
	}
}

const FreezableStreamMixin = new mixin<
	ILinkedStream & IFinishable & IBufferized & INavigable & IRewindable
>(
	{
		name: "FreezableStream",
		properties: {
			update() {
				return (this.curr = this.buffer.read(this.pos))
			},

			lastPos() {
				return this.buffer.size - 1
			},

			posGap() {
				return this.lastPos() - this.pos
			},

			navigateNumber(relativePos: number) {
				const posGap = this.posGap()
				if (this.isFrozen() || posGap >= relativePos) {
					this.pos = max(this.pos + relativePos, 0)
					return this.update()
				}
				this.forward(max(0, posGap))
				uniNavigate(this, relativePos - posGap)
			},

			navigatePredicate(relativePos: IPredicatePosition) {
				if (direction(relativePos)) uniNavigate(this, relativePos)
				else
					while (!relativePos(this) && this.isCurrStart()) this.prev()
			},

			isFrozen() {
				return this.buffer.isFrozen
			},

			baseNextIter() {
				this.forward()
				this.update()
			},

			basePrevIter() {
				this.backward()
				this.update()
			},

			willBeBeyoundBuffer() {
				return this.pos === this.lastPos()
			},

			bufferize(newElem: any) {
				this.buffer.push(newElem)
			},

			freeze() {
				this.buffer.freeze()
				this.endStream()
			},

			handleUnbufferizedNext() {
				this.bufferize(this.curr)
				this.resource!.next()
				this.baseNextIter()
				if (this.resource!.isEnd) this.freeze()
			},

			isCurrEnd(): boolean {
				return this.isFrozen()
					? this.willBeBeyoundBuffer()
					: this.resource!.isCurrEnd()
			},

			next() {
				this.isStart = false
				if (!this.willBeBeyoundBuffer()) this.baseNextIter()
				else if (this.isFrozen()) this.endStream()
				else this.handleUnbufferizedNext()
			},

			prev() {
				this.isEnd = false
				if (this.isCurrStart()) this.startStream()
				else this.basePrevIter()
			},

			navigate(relativePos: IPosition) {
				if (isNumber(relativePos)) this.navigateNumber(relativePos)
				else this.navigatePredicate(relativePos)
				return this.curr
			},

			finish() {
				if (!this.isFrozen()) return this.navigate(T)
				this.pos = this.lastPos()
				this.update()
				return this.curr
			},

			rewind() {
				this.startStream()
				this.pos = 0
				this.update()
				return this.curr
			}
		},
		constructor: function (resource?: IOwnedStream) {
			this.buffer = new OutputBuffer()
			this.super.PipeStream.constructor.call(this, resource)
		}
	},
	[PipeStream, ResourceCopyingStream],
	[DyssyncStream, PosHavingStream]
)

function PreFreezableStream<T = any>() {
	return FreezableStreamMixin.toClass() as typeof FreezableStreamAnnotation<T>
}

export const FreezableStream: ReturnType<typeof PreFreezableStream> & {
	generic?: typeof PreFreezableStream
} = PreFreezableStream()

FreezableStream.generic = PreFreezableStream
