import { mixin } from "../../../mixin.js"
import { StatefulStream } from "../templates.js"
import { BeforeCompositeStream } from "./before/CompositeStream.js"

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
				this.super.StatefulStream.setState.call(this, state)
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
	[BeforeCompositeStream, StatefulStream]
).toClass()

export function CompositeStream(...streams) {
	return function (resource, state) {
		return new _CompositeStream(resource, streams, state)
	}
}
