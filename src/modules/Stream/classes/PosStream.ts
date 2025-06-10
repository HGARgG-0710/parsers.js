import { mixin } from "../../../mixin.js"
import type { ILinkedStream } from "../interfaces/OwnedStream.js"
import type { IPosed } from "../../../interfaces/Position.js"
import { PosHavingStream } from "./PosHavingStream.js"
import { WrapperStream, WrapperStreamAnnotation } from "./WrapperStream.js"

export class PosStreamAnnotation<T = any> extends WrapperStreamAnnotation<T> {
	protected forward(n: number = 1) {}
	protected backward(n: number = 1) {}
	readonly pos: number
}

const PosStreamMixin = new mixin<ILinkedStream & IPosed>(
	{
		name: "PosStream",
		properties: {
			next() {
				this.super.WrapperStream.next.call(this)
				this.super.PosHavingStream.next.call(this)
			},

			prev() {
				this.super.WrapperStream.prev.call(this)
				this.super.PosHavingStream.prev.call(this)
			}
		}
	},
	[],
	[WrapperStream, PosHavingStream]
)

function PrePosStream<T = any>() {
	return PosStreamMixin.toClass() as typeof PosStreamAnnotation<T>
}

export const PosStream: ReturnType<typeof PrePosStream> & {
	generic?: typeof PrePosStream
} = PrePosStream()

PosStream.generic = PrePosStream
