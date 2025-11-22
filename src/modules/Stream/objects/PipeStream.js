import { mixin } from "../../../mixin.js"
import { DelegateStream } from "./DelegateStream.js"
import { PreCommonStream } from "./PreCommonStream.js"

export const PipeStream = new mixin(
	{
		name: "PipeStream",
		properties: {},
		constructor(resource) {
			this.super.DelegateStream.constructor.call(this, resource)
		}
	},
	[DelegateStream, PreCommonStream]
).toClass()
