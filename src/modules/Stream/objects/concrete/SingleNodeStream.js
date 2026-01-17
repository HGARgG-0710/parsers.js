import { mixin } from "../../../../mixin.js"
import { TrivialStream } from "../templates.js"
import { NodeStream } from "./NodeStream.js"

export const SingleNodeStream = new mixin(
	{
		name: "SingleNodeStream",
		properties: {}
	},
	[TrivialStream, NodeStream]
)
