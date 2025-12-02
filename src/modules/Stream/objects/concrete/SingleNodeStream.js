import { mixin } from "../../../../mixin.js"
import { NodeStream, TrivialStream } from "../templates.js"

export const SingleNodeStream = new mixin(
	{
		name: "SingleNodeStream",
		properties: {}
	},
	[TrivialStream, NodeStream]
)
