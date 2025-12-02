import { mixin } from "../../../../mixin.js"
import { DyssyncOwningStream } from "./DyssyncOwningStream.js"
import { PoolableStream } from "./PoolableStream.js"

export const DyssyncOwningPoolableStream = new mixin(
	{
		name: "DyssyncOwningPoolableStream",
		properties: {},
		constructor(resource) {
			this.super.DyssyncOwningStream.constructor.call(this, resource)
		}
	},
	[DyssyncOwningStream, PoolableStream]
)
