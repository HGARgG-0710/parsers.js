import { mixin } from "../../../mixin.js"
import type { IOwnedStream } from "../interfaces/OwnedStream.js"
import { AttachedStream, AttachedStreamAnnotation } from "./AttachedStream.js"
import { ResourceCopyingStream } from "./ResourceCopyingStream.js"

export class IdentityStreamAnnotation<
	T = any,
	Args extends any[] = []
> extends AttachedStreamAnnotation<T, Args> {
	protected ["constructor"]: new (resource?: IOwnedStream<T>) => this

	copy(): this {
		return this
	}
}

const IdentityStreamMixin = new mixin<IOwnedStream>(
	{
		name: "IdentityStream",
		properties: {},
		constructor: function (resource?: IOwnedStream) {
			this.super.AttachedStream.constructor.call(this, resource)
		}
	},
	[ResourceCopyingStream],
	[AttachedStream]
)

function PreIdentityStream<T = any, Args extends any[] = any[]>() {
	return IdentityStreamMixin.toClass() as typeof IdentityStreamAnnotation<
		T,
		Args
	>
}

/**
 * This is a (concrete) mixin of:
 *
 * 1. `ResourceCopyingStream`
 * 2. `AttachedStream`
 *
 * It uses the constructor of `AttachedStream`.
 * 
 * Extremely useful for usage as a default in 
 * `TableHandler`s defining `IStreamChooser`s
 * (since that would just mean to reference the 
 * elements from the underlying `IStream` instead 
 * of transforming them); 
 */
export const IdentityStream: ReturnType<typeof PreIdentityStream> & {
	generic?: typeof PreIdentityStream
} = PreIdentityStream()

IdentityStream.generic = PreIdentityStream
