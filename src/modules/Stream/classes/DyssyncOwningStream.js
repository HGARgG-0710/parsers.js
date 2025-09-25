import { mixin } from "../../../mixin.js"
import { DyssyncStream } from "./DyssyncStream.js"
import { PipeStream } from "./PipeStream.js"
import { ResourceCopyingStream } from "./ResourceCopyingStream.js"
import { SyncCurrStream } from "./SyncCurrStream.js"

export const DyssyncOwningStream = new mixin(
	{
		name: "DyssyncOwningMixin",
		properties: {},
		constructor(resource) {
			this.super.PipeStream.constructor.call(this, resource)
		}
	},
	[DyssyncStream, PipeStream, ResourceCopyingStream, SyncCurrStream],
).toClass()
