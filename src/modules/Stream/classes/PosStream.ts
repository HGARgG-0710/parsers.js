import type { IPositionStream } from "../../../interfaces.js"
import type { IPosed } from "../../../interfaces/Position.js"
import { mixin } from "../../../mixin.js"
import type { ILinkedStream, IOwnedStream } from "../interfaces/OwnedStream.js"
import { PosHavingStream } from "./PosHavingStream.js"
import { WrapperStream, WrapperStreamAnnotation } from "./WrapperStream.js"

export class PosStreamAnnotation<T = any>
	extends WrapperStreamAnnotation<T>
	implements IPositionStream<T>
{
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
		},
		constructor: function (resource: IOwnedStream) {
			this.super.PosHavingStream.constructor.call(this)
			this.super.WrapperStream.constructor.call(this, resource)
		}
	},
	[],
	[WrapperStream, PosHavingStream]
)

function PrePosStream<T = any>() {
	return PosStreamMixin.toClass() as typeof PosStreamAnnotation<T>
}

/**
 * This is a mixin that combines:
 *
 * 1. `WrapperStream`
 * 2. `PosHavingStream`
 *
 * For its `.next()` and `.prev()` operations, it updates the underlying
 * `.resource: IOwnedStream`'s `.curr`, while also updating its `.pos`
 * correspondently.
 *
 * It calls both the constructors from `PosHavingStream` and `WrapperStream`
 */
export const PosStream: ReturnType<typeof PrePosStream> & {
	generic?: typeof PrePosStream
} = PrePosStream()

PosStream.generic = PrePosStream
