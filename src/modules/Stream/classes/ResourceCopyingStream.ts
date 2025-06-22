import type { IResourcefulStream } from "../../../interfaces.js"
import { mixin } from "../../../mixin.js"

/**
 * This is a (sealed) mixin that requires the using party to 
 * define the (optional) `.resource` property. It contains a `.copy` method, 
 * which returns `new this.constructor(this.resource?.copy())`.
 * 
 * Intended to be used as a way to provide the "defualt" `.copy()`-method 
 * for the classes implementing `IResourcefulStream`. 
*/
export const ResourceCopyingStream = new mixin.sealed<IResourcefulStream>({
	name: "ResourceCopyingStream",
	properties: {
		copy() {
			return new this.constructor(this.resource?.copy())
		}
	}
})
