import { mixin } from "../../../mixin.js"

export const ResourceCopyingStream = new mixin({
	name: "ResourceCopyingStream",
	properties: {
		copy() {
			return new this.constructor(this.resource?.copy())
		}
	}
}).toClass()
