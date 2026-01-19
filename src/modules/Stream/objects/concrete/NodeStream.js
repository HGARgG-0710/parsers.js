import { mixin } from "../../../../mixin.js"
import { Stateful } from "../../../../objects.js"
import { CustomLinkedStream } from "../templates/CustomLinkedStream.js"
import { DyssyncStream } from "../templates/DyssyncStream.js"
import { RenewerStream } from "../templates/RenewerStream.js"

export const NodeStream = new mixin(
	{
		name: "NodeStream",
		properties: {
			isCurrEnd() {
				return this.resource.isCurrEnd()
			},

			get pool() {
				return this.constructor.pool
			},

			free() {
				if (this.pool) this.pool.free(this)
			},

			postFree() {
				this.super.CustomLinkedStream.postFree.call(this)
				this.resetCurr()
				this.resetIsEnd()
				this.resetState()
			}
		},
		constructor(resource) {
			this.super.CustomLinkedStream.constructor.call(this, resource)
		}
	},
	[RenewerStream, Stateful, CustomLinkedStream, DyssyncStream]
).toClass()
