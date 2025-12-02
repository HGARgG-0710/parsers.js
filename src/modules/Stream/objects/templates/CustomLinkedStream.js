import { mixin } from "../../../../mixin.js"
import { OwningStream } from "./OwningStream.js"
import { PreCommonStream } from "./PreCommonStream.js"

export const CustomLinkedStream = new mixin(
	{
		name: "CustomLinkedStream",
		properties: {},
		constructor(resource) {
			this.super.OwningStream.constructor.call(this, resource)
		}
	},
	[OwningStream, PreCommonStream]
).toClass()
