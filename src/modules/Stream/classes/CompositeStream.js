import { mixin } from "../../../mixin.js"
import { BeforeCompositeStream } from "./before/CompositeStream.js"
import { StatefulStream } from "./StatefulStream.js"

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
				this.super.StatefulStream.setState(state)
				this.distributeState()
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
