import { mixin } from "../../../mixin.js"
import { OwnableStream } from "./OwnableStream.js"
import { OwningStream } from "./OwningStream.js"

export const CustomLinkedStream = new mixin(
	{
		name: "CustomLinkedStream",
		properties: {},
		constructor(resource) {
			this.super.OwningStream.constructor.call(this, resource)
		}
	},
	[OwningStream, OwnableStream]
)
