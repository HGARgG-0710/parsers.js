import type { IPositionStream } from "../../../interfaces.js"
import type { IPosed } from "../../../interfaces/Position.js"
import { mixin } from "../../../mixin.js"
import type { ILinkedStream, IOwnedStream } from "../interfaces/OwnedStream.js"
import { IdentityStream, IdentityStreamAnnotation } from "./IdentityStream.js"
import { PosHavingStream } from "./PosHavingStream.js"

export class PosStreamAnnotation<T = any>
	extends IdentityStreamAnnotation<T>
	implements IPositionStream<T>
{
	protected forward(n: number = 1) {}
	readonly pos: number
}

const PosStreamMixin = new mixin<ILinkedStream & IPosed>(
	{
		name: "PosStream",
		properties: {
			next() {
				this.super.IdentityStream.next.call(this)
				this.super.PosHavingStream.next.call(this)
			}
		},
		constructor(resource: IOwnedStream) {
			this.super.PosHavingStream.constructor.call(this)
			this.super.IdentityStream.constructor.call(this, resource)
		}
	},
	[],
	[IdentityStream, PosHavingStream]
)

function PrePosStream<T = any>() {
	return PosStreamMixin.toClass() as typeof PosStreamAnnotation<T>
}

/**
 * This is a mixin that combines:
 *
 * 1. `IdentityStream`
 * 2. `PosHavingStream`
 *
 * For its `.next()` operation, it updates the underlying
 * `.resource: IOwnedStream`'s `.curr`, while also 
 * incrementing its `.pos` property. 
 *
 * It calls both the constructors from `PosHavingStream` and `IdentityStream`
 * [in that order].
 */
export const PosStream: ReturnType<typeof PrePosStream> & {
	generic?: typeof PrePosStream
} = PrePosStream()

PosStream.generic = PrePosStream
