import { mixin } from "../../../../mixin.js"
import { Stateful } from "../../../../objects.js"
import { CustomLinkedStream } from "./CustomLinkedStream.js"
import { DyssyncStream } from "./DyssyncStream.js"
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
		}, 
		constructor(resource) {
			this.super.CustomLinkedStream.constructor.call(this, resource)
		}
	},
	[RenewerStream, Stateful, CustomLinkedStream, DyssyncStream]
).toClass()
