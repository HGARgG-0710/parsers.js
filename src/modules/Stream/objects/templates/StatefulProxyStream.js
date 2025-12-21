import { mixin } from "../../../../mixin.js"
import { Stateful } from "../../../../objects.js"
import { ProxyStream } from "../templates.js"

export const StatefulProxyStream = new mixin(
	{
		name: "StatefulProxyStream",
		properties: {
			setState(state) {
				this.super.ProxyStream.setState.call(this, state)
				this.super.Stateful.setState.call(this, state)
			}
		}
	},
	[ProxyStream, Stateful]
)
