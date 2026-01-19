import { mixin } from "../../../../mixin.js"
import {
	OwnerResettable,
	ResourceResettable
} from "../../../../objects/Resettable.js"

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
