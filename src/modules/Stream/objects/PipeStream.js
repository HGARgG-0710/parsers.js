import { mixin } from "../../../mixin.js"
import { CommonStream } from "./CommonStream.js"
import { DelegateStream } from "./DelegateStream.js"

export const PipeStream = new mixin(
	{
		name: "PipeStream",
		properties: {},
		constructor(resource) {
			this.super.DelegateStream.constructor.call(this, resource)
		}
	},
	[DelegateStream, CommonStream]
).toClass()
