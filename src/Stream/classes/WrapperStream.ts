import type { IOwnedStream } from "../interfaces.js"
import { OwnedStream } from "./OwnedStream.js"

export class WrapperStream<Type = any> extends OwnedStream<Type> {
	resource?: IOwnedStream<Type>

	init(resource: IOwnedStream<Type>) {
		this.resource = resource
		resource.claimBy(this)
		return this
	}

	constructor(resource?: IOwnedStream<Type>) {
		super()
		if (resource) this.init(resource)
	}
}
