import { mixin } from "../../../mixin.js"
import { PipeStream } from "./PipeStream.js"
import { SyncStream } from "./SyncStream.js"

export const AttachedStream = new mixin(
	{
		name: "AttachedStream",
		properties: {},
		constructor(resource) {
			this.super.PipeStream.constructor.call(this, resource)
		}
	},
	[PipeStream, SyncStream]
).toClass()
