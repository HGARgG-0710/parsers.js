import { BadId } from "../../../../constants.js"
import { mixin } from "../../../../mixin.js"
import { LinkedResettable } from "../Resettable.js"
import { OwningStream } from "./OwningStream.js"
import { PreCommonStream } from "./PreCommonStream.js"

export const CustomLinkedStream = new mixin(
	{
		name: "CustomLinkedStream",
		properties: {
			get poolId() {
				return BadId
			}
		},
		constructor(resource) {
			this.super.OwningStream.constructor.call(this, resource)
		}
	},
	[OwningStream, PreCommonStream, LinkedResettable]
).toClass()
