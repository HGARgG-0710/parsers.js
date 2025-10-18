import { mixin } from "../../../mixin.js"
import { Initializable } from "../../../objects/Initializer.js"
import { OwnableStream } from "./OwnableStream.js"
import { PoolableStream } from "./PoolableStream.js"

export const CustomLinkedStream = new mixin(
	{
		name: "CustomLinkedStream",
		properties: {},
		constructor(resource) {
			this.super.Initializable.constructor.call(this, resource)
		}
	},
	[Initializable, OwnableStream, PoolableStream]
)
