import { mixin } from "../../../../mixin.js"
import { DyssyncStream } from "./DyssyncStream.js"
import { PreCommonStream } from "./PreCommonStream.js"
import { RenewerStream } from "./RenewerStream.js"

export const NodeStream = new mixin(
	{
		name: "NodeStream",
		properties: {
			get pool() {
				return this.constructor.pool
			},

			free() {
				if (this.pool) this.pool.free(this)
			}
		}
	},
	[RenewerStream, PreCommonStream, DyssyncStream]
).toClass()
