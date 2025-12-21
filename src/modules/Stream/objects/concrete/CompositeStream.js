import { Stateful } from "../../../../objects.js"
import { mixin } from "../../../mixin.js"
import { BeforeCompositeStream } from "../before/CompositeStream.js"

const _CompositeStream = new mixin(
	{
		name: "CompositeStream",
		properties: {},
		constructor(lowStream, rawStreams, state) {
			this.super.BeforeCompositeStream.constructor.call(
				this,
				lowStream,
				rawStreams,
				state
			)
		}
	},
	[BeforeCompositeStream, Stateful]
).toClass()

export function CompositeStream(...streams) {
	return function (resource, state) {
		return new _CompositeStream(resource, streams, state)
	}
}
