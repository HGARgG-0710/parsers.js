import { BadId } from "../../../../constants.js"
import { mixin } from "../../../../mixin.js"
import { BasicPoolable } from "../../../../objects.js"
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
	[BasicPoolable, OwningStream, PreCommonStream, LinkedResettable]
).toClass()
