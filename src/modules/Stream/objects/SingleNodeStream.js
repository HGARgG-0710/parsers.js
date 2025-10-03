import { mixin } from "../../../mixin.js"
import { NodeStream } from "./NodeStream.js"
import { TrivialStream } from "./TrivialStream.js"

export const SingleNodeStream = new mixin(
	{
		name: "SingleNodeStream",
		properties: {}
	},
	[TrivialStream, NodeStream]
)
