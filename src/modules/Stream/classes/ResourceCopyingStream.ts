import type { IResourcefulStream } from "../../../interfaces.js"
import { mixin } from "../../../mixin.js"

export const ResourceCopyingStream = new mixin.sealed<IResourcefulStream>({
	name: "ResourceCopyingStream",
	properties: {
		copy() {
			return new this.constructor(this.resource?.copy())
		}
	}
})
