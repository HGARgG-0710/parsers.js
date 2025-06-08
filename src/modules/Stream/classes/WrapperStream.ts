import { mixin } from "../../../mixin.js"
import type { IOwnedStream } from "../interfaces/OwnedStream.js"
import { AttachedStream, AttachedStreamAnnotation } from "./AttachedStream.js"
import { ResourceCopyingStream } from "./ResourceCopyingStream.js"

export abstract class WrapperStreamAnnotation<
	T = any,
	Args extends any[] = []
> extends AttachedStreamAnnotation<T, Args> {
	protected ["constructor"]: new (resource?: IOwnedStream<T>) => this

	copy(): this {
		return this
	}
}

const WrapperStreamMixin = new mixin<IOwnedStream>(
	{
		name: "WrapperStream",
		properties: {},
		constructor: function (resource?: IOwnedStream) {
			this.super.AttachedStream.constructor.call(this, resource)
		}
	},
	[ResourceCopyingStream],
	[AttachedStream]
)

function PreWrapperStream<T = any, Args extends any[] = any[]>() {
	return WrapperStreamMixin.toClass() as typeof WrapperStreamAnnotation<
		T,
		Args
	>
}

export const WrapperStream: ReturnType<typeof PreWrapperStream> & {
	generic?: typeof PreWrapperStream
} = PreWrapperStream()

WrapperStream.generic = PreWrapperStream
