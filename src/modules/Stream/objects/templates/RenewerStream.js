import { mixin } from "../../../../mixin.js"
import { Stateful } from "../../../../objects.js"
import { OwningStream } from "./OwningStream.js"

export const RenewerStream = new mixin(
	{
		name: "RenewerStream",
		properties: {
			reviveChild() {
				return this.state.parse.renewStream(this.resource)
			}
		}
	},
	[Stateful, OwningStream]
).toClass()
