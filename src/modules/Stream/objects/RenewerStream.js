import { mixin } from "../../../mixin.js"
import { OwningStream } from "./OwningStream.js"
import { StatefulStream } from "./StatefulStream.js"

export const RenewerStream = new mixin(
	{
		name: "RenewerStream",
		properties: {
			reviveChild() {
				return this.state.parse.renewStream(this.resource)
			}
		}
	},
	[StatefulStream, OwningStream]
).toClass()
