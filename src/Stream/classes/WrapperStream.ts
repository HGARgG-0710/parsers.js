import { OwnedStream } from "./OwnedStream.js"

export class WrapperStream<Type = any> extends OwnedStream<Type> {
	resource?: OwnedStream<Type>

	init(resource: OwnedStream<Type>) {
		this.resource = resource
		resource.claimBy(this)
		return this
	}

	constructor(resource?: OwnedStream<Type>) {
		super()
		if (resource) this.init(resource)
	}
}
