import { mixin } from "../../../mixin.js"
import { DelegateStream } from "./DelegateStream.js"
import { IterableStream } from "./IterableStream.js"
import { OwnableStream } from "./OwnableStream.js"

export const PipeStream = new mixin(
	{
		name: "PipeStream",
		properties: {},
		constructor(resource) {
			this.super.DelegateStream.constructor.call(this, resource)
		}
	},
	[],
	[IterableStream, DelegateStream, OwnableStream]
).toClass()
