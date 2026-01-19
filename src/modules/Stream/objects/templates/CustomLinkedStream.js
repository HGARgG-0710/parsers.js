import { mixin } from "../../../../mixin.js"
import { ObjectPool } from "../../../../objects.js"
import { OwningStream } from "./OwningStream.js"
import { PreCommonStream } from "./PreCommonStream.js"

export const CustomLinkedStream = new mixin(
	{
		name: "CustomLinkedStream",
		properties: {
			get poolId() {
				return ObjectPool.BadPoolID
			}
		},
		constructor(resource) {
			this.super.OwningStream.constructor.call(this, resource)
		}
	},
	[OwningStream, PreCommonStream]
).toClass()
