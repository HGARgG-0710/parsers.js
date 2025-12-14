import { Stateful } from "../../../../objects.js"
import { isStateful } from "../../../../utils/Stream.js"
import { mixin } from "../../../mixin.js"
import { BeforeCompositeStream } from "../before/CompositeStream.js"

const _CompositeStream = new mixin(
	{
		name: "CompositeStream",
		properties: {
			distributeState() {
				for (const x of this.rawStreams)
					if (isStateful(x)) x.setState(this.state)
			},

			free() {},

			setState(state) {
				this.super.Stateful.setState.call(this, state)
				this.distributeState()
				return this
			}
		},
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
