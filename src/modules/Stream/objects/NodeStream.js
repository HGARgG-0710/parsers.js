import { mixin } from "../../../mixin.js"
import { CommonStream } from "./CommonStream.js"
import { DyssyncStream } from "./DyssyncStream.js"
import { RenewerStream } from "./RenewerStream.js"
import { ResourceCopyingStream } from "./ResourceCopyingStream.js"

export const NodeStream = new mixin(
	{
		name: "NodeStream",
		properties: {
			free() {}
		}
	},
	[RenewerStream, CommonStream, DyssyncStream, ResourceCopyingStream]
).toClass()
