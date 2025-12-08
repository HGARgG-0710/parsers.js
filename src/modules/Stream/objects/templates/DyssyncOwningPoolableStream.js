import { mixin } from "../../../../mixin.js"
import { Poolable } from "../../../../objects.js"
import { DyssyncOwningStream } from "./DyssyncOwningStream.js"

export const DyssyncOwningPoolableStream = new mixin(
	{
		name: "DyssyncOwningPoolableStream",
		properties: {},
		constructor(resource) {
			this.super.DyssyncOwningStream.constructor.call(this, resource)
		}
	},
	[DyssyncOwningStream, Poolable]
)
