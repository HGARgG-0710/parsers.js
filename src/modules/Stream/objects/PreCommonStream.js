import { mixin } from "../../../mixin.js"
import { IterableStream } from "./IterableStream.js"
import { OwnableStream } from "./OwnableStream.js"

export const PreCommonStream = new mixin(
	{
		name: "CommonStream",
		properties: {}
	},
	[OwnableStream, IterableStream]
).toClass()
