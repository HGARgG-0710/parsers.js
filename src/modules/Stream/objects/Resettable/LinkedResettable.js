import { mixin } from "../../../../mixin.js"
import { OwnerResettable } from "./OwnerResettable.js"
import { ResourceResettable } from "./ResourceResettable.js"

export const LinkedResettable = new mixin(
	{
		name: "LinkedResettable",
		properties: {
			postFree() {
				this.super.OwnerResettable.resetOwner.call(this)
				this.super.ResourceResettable.resetResource.call(this)
			}
		}
	},
	[OwnerResettable, ResourceResettable]
)
